// ==============================================================================
//                  © 2025 Dedalus Labs, Inc. and affiliates
//                            Licensed under MIT
//           github.com/dedalus-labs/dedalus-sdk-typescript/LICENSE
// ==============================================================================

import type { Message } from './types/messages';
import type { JsonValue, ToolResult, Tool } from './types/tools';
import { createToolHandler } from './tools';
import { accumulateToolCalls } from './streaming';
import { buildInitialMessages, coerceToolCall } from './messages';
import { buildRequestKwargs, normalizeModelSpec } from './validation';
import { jsonify } from '../utils/format';
import type { Dedalus } from '../../client';
import type { CompletionCreateParamsBase, StreamChunk } from '../../resources/chat/completions';
import type { DedalusModelChoice } from '../../resources/shared';
import { loggerFor } from '../../internal/utils/log';
import type { Stream } from '../../core/streaming';

export type RunParams = Omit<
  CompletionCreateParamsBase,
  'messages' | 'model' | 'tools' | 'mcp_servers' | 'auto_execute_tools'
> & {
  input?: string | Message[];
  messages?: Message[];
  instructions?: string;
  model: DedalusModelChoice | DedalusModelChoice[] | undefined;
  tools?: Iterable<Tool>;
  maxSteps?: number;
  mcpServers?: Iterable<string>;
  autoExecuteTools?: boolean;
  responseFormat?: { [key: string]: unknown };
  transport?: 'http';
  verbose?: boolean;
  debug?: boolean;
  returnIntent?: boolean;
};

function createLogger(client: Dedalus, verbose: boolean, debug: boolean) {
  const logger = loggerFor(client);

  return {
    step: (step: number, max: number) => {
      if (verbose) logger.info(`[DedalusRunner] Step ${step}/${max}`);
    },

    models: (
      requested: DedalusModelChoice | DedalusModelChoice[],
      previous?: DedalusModelChoice | DedalusModelChoice[] | null,
    ) => {
      if (!verbose) return;
      const current = Array.isArray(requested) ? requested.join(', ') : String(requested);
      if (previous == null) {
        logger.info(`[DedalusRunner] Calling model: ${current}`);
      } else {
        const prev = Array.isArray(previous) ? previous.join(', ') : String(previous);
        if (prev !== current) {
          logger.info(`[DedalusRunner] Handoff to model: ${current}`);
        }
      }
    },

    toolSchema: (toolNames: string[]) => {
      if (verbose && toolNames.length) {
        logger.info(`[DedalusRunner] Local tools available: ${toolNames.join(', ')}`);
      }
    },

    toolExecution: (name: string, result: unknown, error = false) => {
      if (!verbose) return;
      const stringified = jsonify(result);
      const summary = stringified.length <= 80 ? stringified : stringified.slice(0, 79) + '…';
      const verb = error ? 'errored' : 'returned';
      logger.info(`[DedalusRunner] Tool ${name} ${verb}: ${summary}`);
    },

    messagesSnapshot: (messages: Message[]) => {
      if (!(verbose && debug)) return;
      logger.debug('[DedalusRunner] Conversation so far:');
      messages.slice(-6).forEach((msg, idx) => {
        const role = (msg as any).role ?? '?';
        const content = (msg as any).content;
        let snippet: string;
        if (Array.isArray(content)) {
          snippet = '[array content]';
        } else {
          const str = jsonify(content ?? '');
          snippet = str.length <= 60 ? str : str.slice(0, 59) + '…';
        }
        logger.debug(`  [${idx}] ${role}: ${snippet}`);
      });
    },

    finalSummary: (models: DedalusModelChoice[], tools: string[]) => {
      if (!verbose) return;
      const modelNames = models.map((m) => (typeof m === 'string' ? m : m.model));
      logger.info(`[DedalusRunner] Models used: ${modelNames.join(', ')}`);
      logger.info(`[DedalusRunner] Tools called: ${tools.join(', ')}`);
    },
  };
}

type RunnerState = {
  model: DedalusModelChoice | DedalusModelChoice[];
  requestKwargs: Record<string, JsonValue>;
  autoExecuteTools: boolean;
  maxSteps: number;
  mcpServers: string[];
  logger: ReturnType<typeof createLogger>;
  toolHandler: ReturnType<typeof createToolHandler>;
  stream: boolean;
};

export class RunResult {
  constructor(
    public finalOutput: string,
    public toolResults: ToolResult[],
    public stepsUsed: number,
    public conversationHistory: Message[] = [],
    public toolsCalled: string[] = [],
    public modelsUsed: DedalusModelChoice[] = [],
  ) {}

  get output(): string {
    return this.finalOutput;
  }
  get content(): string {
    return this.finalOutput;
  }

  toInputList(): Message[] {
    return [...this.conversationHistory];
  }
}

/** Client wrapper with local tool execution and multi-turn conversation support. */
export class DedalusRunner {
  constructor(
    private client: Dedalus,
    private verbose = false,
  ) {}

  /** Executes conversation with automatic tool calling up to maxSteps. */
  async run(params: RunParams): Promise<RunResult | AsyncIterableIterator<any>> {
    const {
      input,
      tools,
      messages,
      instructions,
      model,
      maxSteps = 10,
      mcpServers,
      stream = false,
      transport = 'http',
      autoExecuteTools = true,
      verbose,
      debug,
      returnIntent = false,
      ...apiParams
    } = params;

    if (!model) throw new Error('model must be provided');
    if (transport !== 'http') throw new Error('DedalusRunner currently supports only HTTP transport');
    if (returnIntent) {
      console.warn('`returnIntent` is deprecated; use autoExecuteTools=false to inspect raw tool_calls.');
    }

    const toolHandler = createToolHandler(tools ?? []);
    const logger = createLogger(this.client, this.verbose ?? !!verbose, !!debug);
    logger.toolSchema(toolHandler.listNames());

    const modelSpec = normalizeModelSpec(model);
    const requestKwargs = buildRequestKwargs(apiParams);

    const state: RunnerState = {
      model: modelSpec,
      requestKwargs,
      autoExecuteTools,
      maxSteps: Math.max(1, maxSteps),
      mcpServers: Array.from(mcpServers ?? []),
      logger,
      toolHandler,
      stream: Boolean(stream ?? false),
    };

    const conversation = buildInitialMessages({
      instructions,
      input,
      messages,
    });

    if (stream) {
      return this.runStreaming(conversation, state);
    }

    return await this.runTurns(conversation, state);
  }

  /** Executes synchronous multi-turn conversation with tool support. */
  private async runTurns(conversation: Message[], state: RunnerState): Promise<RunResult> {
    const history = [...conversation];
    const toolSchemas = state.toolHandler.schemas() || null;
    let finalText = '';
    const toolResults: ToolResult[] = [];
    const toolsCalled: string[] = [];
    const modelsUsed: DedalusModelChoice[] = [];
    let previousModel: DedalusModelChoice | DedalusModelChoice[] | null = null;
    let steps = 0;

    while (steps < state.maxSteps) {
      steps += 1;
      state.logger.step(steps, state.maxSteps);
      state.logger.messagesSnapshot(history);
      state.logger.models(state.model, previousModel);

      const modelSpec = Array.isArray(state.model) ? state.model[0] : state.model;
      if (modelSpec && !modelsUsed.includes(modelSpec)) {
        modelsUsed.push(modelSpec);
      }
      previousModel = state.model;

      const createParams: CompletionCreateParamsBase = {
        model: state.model,
        messages: history,
        tools: toolSchemas,
        mcp_servers: state.mcpServers.length ? state.mcpServers : null,
        stream: state.stream,
        ...state.requestKwargs,
      };

      const response = await this.client.chat.completions.create(createParams);

      let toolCalls: Array<{ id?: string; type?: string; function?: { name?: string; arguments?: string } }> =
        [];
      let content: string | undefined;

      if (state.stream) {
        const collectedToolCalls: any[] = [];
        const collectedContent: string[] = [];

        for await (const chunk of response as any) {
          if (chunk.choices) {
            const choice = chunk.choices[0];
            const delta = choice?.delta;
            if (delta) {
              if (delta.tool_calls) {
                accumulateToolCalls(delta.tool_calls, collectedToolCalls);
              }
              if (delta.content) {
                collectedContent.push(delta.content);
              }
            }
          }
        }

        if (collectedToolCalls.length) {
          const localToolNames = new Set(state.toolHandler.listNames());
          const mcpNames = collectedToolCalls
            .map((call) => call.function?.name)
            .filter((name): name is string => name != null && !localToolNames.has(name));
          const hasStreamedContent = collectedContent.length > 0;

          // MCP tools + streamed content means server already handled execution
          if (mcpNames.length && hasStreamedContent) {
            finalText = collectedContent.join('');
            if (finalText) {
              history.push({ role: 'assistant', content: finalText } as unknown as Message);
            }
            break;
          }

          const allMcp = collectedToolCalls.every((call) => {
            const name = call.function?.name;
            return name != null && !localToolNames.has(name);
          });

          if (allMcp) {
            toolCalls = [];
          } else {
            toolCalls = collectedToolCalls.filter((call) => {
              const name = call.function?.name;
              return name != null && localToolNames.has(name);
            });
          }
        } else {
          toolCalls = [];
          finalText = collectedContent.join('');
          if (finalText) {
            history.push({ role: 'assistant', content: finalText } as unknown as Message);
          }
          break;
        }
      } else {
        const completion = response as any;
        if (!completion?.choices?.length) break;

        const choice = completion.choices[0];
        const message = choice.message;
        toolCalls = message.tool_calls || [];
        content = message.content;

        if (!toolCalls.length) {
          finalText = content || '';
          if (finalText) {
            history.push({ role: 'assistant', content: finalText } as unknown as Message);
          }
          break;
        }
      }

      const toolPayloads = toolCalls.map((call) => coerceToolCall(call));
      for (const payload of toolPayloads) {
        const name = payload.function?.name;
        if (name && !toolsCalled.includes(name)) toolsCalled.push(name);
      }

      history.push({ role: 'assistant', tool_calls: toolPayloads } as unknown as Message);

      if (!state.autoExecuteTools) break;

      await this.executeToolCallsSync({
        toolCalls: toolPayloads,
        toolHandler: state.toolHandler,
        history,
        toolResults,
        toolsCalled,
        step: steps,
        logger: state.logger,
      });
    }

    state.logger.finalSummary(modelsUsed, toolsCalled);
    return new RunResult(finalText, toolResults, steps, history, toolsCalled, modelsUsed);
  }

  /** Executes streaming conversation, yielding content deltas. */
  private async *runStreaming(conversation: Message[], state: RunnerState): AsyncIterableIterator<any> {
    const history = [...conversation];
    const toolSchemas = state.toolHandler.schemas() || null;
    let previousModel: DedalusModelChoice | DedalusModelChoice[] | null = null;
    let steps = 0;
    const modelsUsed: DedalusModelChoice[] = [];

    while (steps < state.maxSteps) {
      steps += 1;
      state.logger.step(steps, state.maxSteps);
      state.logger.messagesSnapshot(history);
      state.logger.models(state.model, previousModel);

      const modelSpec = Array.isArray(state.model) ? state.model[0] : state.model;
      if (modelSpec && !modelsUsed.includes(modelSpec)) {
        modelsUsed.push(modelSpec);
      }
      previousModel = state.model;

      const createParams: CompletionCreateParamsBase = {
        model: state.model,
        messages: history,
        tools: toolSchemas,
        mcp_servers: state.mcpServers.length ? state.mcpServers : null,
        stream: true,
        ...state.requestKwargs,
      };

      const stream = (await this.client.chat.completions.create(createParams)) as Stream<StreamChunk>;

      const collectedToolCalls: Array<{
        index?: number;
        id?: string;
        type?: string;
        function?: { name?: string; arguments?: string };
      }> = [];
      const collectedContent: string[] = [];

      for await (const chunk of stream) {
        yield chunk;

        if (chunk.choices) {
          const choice = chunk.choices[0];
          const delta = choice?.delta;
          if (delta) {
            if (delta.tool_calls) {
              accumulateToolCalls(delta.tool_calls, collectedToolCalls);
            }
            if (delta.content) {
              collectedContent.push(delta.content);
            }
          }
        }
      }

      if (!collectedToolCalls.length) {
        const finalText = collectedContent.join('');
        if (finalText) {
          history.push({ role: 'assistant', content: finalText } as unknown as Message);
        }
        break;
      }

      const localToolNames = new Set(state.toolHandler.listNames());
      const mcpNames = collectedToolCalls
        .map((call) => call.function?.name)
        .filter((name): name is string => name != null && !localToolNames.has(name));
      const hasStreamedContent = collectedContent.length > 0;

      // MCP tools + streamed content means server already handled execution
      if (mcpNames.length && hasStreamedContent) {
        const finalText = collectedContent.join('');
        if (finalText) {
          history.push({ role: 'assistant', content: finalText } as unknown as Message);
        }
        break;
      }

      const allMcp = collectedToolCalls.every((call) => {
        const name = call.function?.name;
        return name != null && !localToolNames.has(name);
      });

      if (allMcp) {
        break;
      }

      const localToolCalls = collectedToolCalls.filter((call) => {
        const name = call.function?.name;
        return name != null && localToolNames.has(name);
      });

      const toolPayloads = localToolCalls.map((call) => coerceToolCall(call));
      history.push({ role: 'assistant', tool_calls: toolPayloads } as unknown as Message);

      if (!state.autoExecuteTools) break;

      const toolResults: ToolResult[] = [];
      const toolsCalled: string[] = [];

      for (const toolCall of toolPayloads) {
        const name = toolCall.function?.name ?? '';
        const argsRaw = toolCall.function?.arguments;
        let args: Record<string, any> = {};
        if (argsRaw && typeof argsRaw === 'object' && !Array.isArray(argsRaw)) {
          args = argsRaw;
        } else if (typeof argsRaw === 'string') {
          try {
            args = JSON.parse(argsRaw);
          } catch {
            args = {};
          }
        }

        try {
          const result = await state.toolHandler.exec(name, args);
          toolResults.push({ name, result, step: steps });
          if (!toolsCalled.includes(name)) toolsCalled.push(name);

          history.push({
            role: 'tool',
            tool_call_id: toolCall.id ?? '',
            content: typeof result === 'string' ? result : JSON.stringify(result),
          } as unknown as Message);
          state.logger.toolExecution(name, result);
        } catch (error: any) {
          history.push({
            role: 'tool',
            tool_call_id: toolCall.id ?? '',
            content: `Error: ${String(error?.message ?? error)}`,
          } as unknown as Message);
          state.logger.toolExecution(name, error, true);
        }
      }
    }
  }

  /** Executes local tools and appends results to conversation. */
  private async executeToolCallsSync({
    toolCalls,
    toolHandler,
    history,
    toolResults,
    toolsCalled,
    step,
    logger,
  }: {
    toolCalls: Array<any>;
    toolHandler: ReturnType<typeof createToolHandler>;
    history: Message[];
    toolResults: ToolResult[];
    toolsCalled: string[];
    step: number;
    logger: ReturnType<typeof createLogger>;
  }): Promise<void> {
    for (const toolCall of toolCalls) {
      const name = toolCall.function?.name ?? '';
      const argsRaw = toolCall.function?.arguments;
      let args: Record<string, any> = {};
      if (argsRaw && typeof argsRaw === 'object' && !Array.isArray(argsRaw)) {
        args = argsRaw;
      } else if (typeof argsRaw === 'string') {
        try {
          args = JSON.parse(argsRaw);
        } catch {
          args = {};
        }
      }

      try {
        const result = await toolHandler.exec(name, args);
        toolResults.push({ name, result, step });
        if (!toolsCalled.includes(name)) toolsCalled.push(name);

        history.push({
          role: 'tool',
          tool_call_id: toolCall.id ?? '',
          content: typeof result === 'string' ? result : JSON.stringify(result),
        } as unknown as Message);
        logger.toolExecution(name, result);
      } catch (error: any) {
        history.push({
          role: 'tool',
          tool_call_id: toolCall.id ?? '',
          content: `Error: ${String(error?.message ?? error)}`,
        } as unknown as Message);
        logger.toolExecution(name, error, true);
      }
    }
  }
}
