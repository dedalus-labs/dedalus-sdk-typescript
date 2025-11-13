// ==============================================================================
//                  © 2025 Dedalus Labs, Inc. and affiliates
//                            Licensed under MIT
//           github.com/dedalus-labs/dedalus-sdk-python/LICENSE
// ==============================================================================

import type { Message } from "./types/messages";
import type { JsonValue, ToolResult } from "./types/tools";
import { InputGuardrailTriggered, OutputGuardrailTriggered, GuardrailCheckResult, type GuardrailFunc } from "./guardrails";
import { toSchema } from "../utils/schemas";

// ---------------------------------------------------------------------------
// External client surface (minimal structural typing)
// ---------------------------------------------------------------------------

type ChatCreateArgs = {
  model: string | string[];
  messages: Message[];
  tools?: Array<Record<string, any>> | null;
  mcp_servers?: string[] | null;
  // plus any other request kwargs...
  [k: string]: any;
};

type ChatChoice = {
  message: any; // we'll coerce with _messageToObject
};

type ChatResponse = {
  choices?: ChatChoice[];
};

type DedalusLikeClient = {
  chat: {
    completions: {
      create(args: ChatCreateArgs): Promise<any>;
    };
  };
};

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export type RunnerHooks = {
  on_before_run?: (messages: Message[]) => void;
  on_after_run?: (result: _RunResult) => void;
  on_before_model_call?: (payload: { model: string | string[]; messages: Message[]; kwargs: Record<string, any> }) => void;
  on_after_model_call?: (response: any) => void;
  on_before_tool?: (name: string, args: Record<string, any>) => void;
  on_after_tool?: (name: string, resultOrError: JsonValue | Error) => void;
  on_guardrail_trigger?: (name: string, result: GuardrailCheckResult) => void;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderModelSpec(spec: string | string[]): string {
  return Array.isArray(spec) ? spec.map(String).join(", ") : String(spec);
}

function truncate(value: string, length = 80): string {
  return value.length <= length ? value : value.slice(0, length - 1) + "…";
}

function jsonify(value: any): string {
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function parseArguments(raw: any): Record<string, any> {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) return { ...raw };
  if (!raw) return {};
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
  return {};
}

function messageToObject(message: any): Record<string, any> {
  if (!message) return {};
  if (typeof message === "object") {
    if (typeof (message as any).toJSON === "function") {
      try { return (message as any).toJSON(); } catch {}
    }
    return { ...message };
  }
  return {};
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// ---------------------------------------------------------------------------
// Logging (minimal, matches behaviourally)
// ---------------------------------------------------------------------------

class DebugLogger {
  constructor(private enabled: boolean, private debug: boolean) {}

  log(msg: string) {
    if (this.enabled) console.log(`[DedalusRunner] ${msg}`);
  }

  step(step: number, max: number) {
    this.log(`Step ${step}/${max}`);
  }

  models(requested: string | string[], previous?: string | string[] | null) {
    if (!this.enabled) return;
    const current = renderModelSpec(requested);
    if (previous == null) this.log(`Calling model: ${current}`);
    else if (renderModelSpec(previous) !== current) this.log(`Handoff to model: ${current}`);
  }

  toolSchema(toolNames: string[]) {
    if (this.enabled && toolNames.length) this.log(`Local tools available: ${toolNames}`);
  }

  toolExecution(name: string, result: any, error = false) {
    if (!this.enabled) return;
    const summary = truncate(jsonify(result));
    const verb = error ? "errored" : "returned";
    this.log(`Tool ${name} ${verb}: ${summary}`);
  }

  messagesSnapshot(messages: Message[]) {
    if (!(this.enabled && this.debug)) return;
    this.log("Conversation so far:");
    messages.slice(-6).forEach((msg, idx) => {
      const role = (msg as any).role ?? "?";
      const content = (msg as any).content;
      const snippet = Array.isArray(content) ? "[array content]" : truncate(jsonify(content ?? ""), 60);
      this.log(`  [${idx}] ${role}: ${snippet}`);
    });
  }

  finalSummary(models: string[], tools: string[]) {
    if (!this.enabled) return;
    this.log(`Models used: ${models}`);
    this.log(`Tools called: ${tools}`);
  }
}

// ---------------------------------------------------------------------------
// Function tool handler (TS equivalent)
// ---------------------------------------------------------------------------

class FunctionToolHandler {
  private funcs: Record<string, (...args: any[]) => any>;

  constructor(funcs: Iterable<(...args: any[]) => any>) {
    this.funcs = {};
    for (const fn of funcs) this.funcs[(fn as any).name] = fn;
  }

  schemas(): Array<Record<string, any>> {
    const out: Array<Record<string, any>> = [];
    for (const fn of Object.values(this.funcs)) {
      try { out.push(toSchema(fn)); } catch { /* best effort */ }
    }
    return out;
  }

  async exec(name: string, args: Record<string, any>): Promise<JsonValue> {
    const fn = this.funcs[name];
    if (!fn) throw new Error(`Unknown tool: ${name}`);
    const res = fn.length === 1 ? fn(args) : fn(...Object.values(args));
    return await Promise.resolve(res);
  }

  listNames(): string[] {
    return Object.keys(this.funcs);
  }
}

// ---------------------------------------------------------------------------
// Runner state & result
// ---------------------------------------------------------------------------

type RunnerState = {
  model: string | string[];
  request_kwargs: Record<string, any>;
  auto_execute_tools: boolean;
  max_steps: number;
  mcp_servers: string[];
  logger: DebugLogger;
  tool_handler: FunctionToolHandler;
  input_guardrails: GuardrailFunc[];
  output_guardrails: GuardrailFunc[];
  hooks: RunnerHooks;
  stream: boolean;
};

export class _RunResult {
  constructor(
    public final_output: string,
    public tool_results: ToolResult[],
    public steps_used: number,
    public messages: Message[] = [],
    public tools_called: string[] = [],
    public models_used: string[] = [],
    public input_guardrail_results: GuardrailCheckResult[] = [],
    public output_guardrail_results: GuardrailCheckResult[] = []
  ) {}

  // Back-compat getters
  get output(): string { return this.final_output; }
  get content(): string { return this.final_output; }

  to_input_list(): Message[] {
    return [...this.messages];
  }
}

// ---------------------------------------------------------------------------
// DedalusRunner (TypeScript)
// ---------------------------------------------------------------------------

export class DedalusRunner {
  constructor(private client: DedalusLikeClient, private verbose = false) {}

  async run({
    input = undefined as string | Message[] | undefined,
    tools = undefined as Iterable<(...args: any[]) => any> | undefined,
    messages = undefined as Message[] | undefined,
    instructions = undefined as string | undefined,
    model,
    max_steps = 10,
    mcp_servers = undefined as Iterable<string> | undefined,
    temperature,
    max_tokens,
    top_p,
    frequency_penalty,
    presence_penalty,
    logit_bias,
    stream = false,
    transport = "http",
    auto_execute_tools = true,
    verbose,
    debug,
    return_intent = false,
    agent_attributes,
    model_attributes,
    tool_choice,
    guardrails,
    handoff_config,
    input_guardrails = [],
    output_guardrails = [],
    hooks = {} as RunnerHooks,
  }: {
    input?: string | Message[];
    tools?: Iterable<(...args: any[]) => any>;
    messages?: Message[];
    instructions?: string;
    model: string | string[] | { name: string } | Iterable<{ name: string }> | undefined;
    max_steps?: number;
    mcp_servers?: Iterable<string>;
    // request kwargs:
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    logit_bias?: Record<string, number>;
    stream?: boolean;
    transport?: "http";
    auto_execute_tools?: boolean;
    verbose?: boolean;
    debug?: boolean;
    return_intent?: boolean;
    agent_attributes?: Record<string, number>;
    model_attributes?: Record<string, Record<string, number>>;
    tool_choice?: string | Record<string, JsonValue>;
    guardrails?: Array<Record<string, JsonValue>>;
    handoff_config?: Record<string, JsonValue>;
    input_guardrails?: Iterable<GuardrailFunc>;
    output_guardrails?: Iterable<GuardrailFunc>;
    hooks?: RunnerHooks;
  }): Promise<_RunResult | AsyncIterableIterator<any>> {
    if (!model) throw new Error("model must be provided");
    // Streaming is supported - when enabled, returns an AsyncIterator that can be passed to streamAsync()
    // When stream=false, returns a _RunResult with the final output
    // Note: Requires server-side SSE (Server-Sent Events) support
    // If streaming fails with errors, the server may not support SSE format
    if (transport !== "http") throw new Error("DedalusRunner currently supports only HTTP transport");
    if (return_intent) {
      // parity with Python: emit a warning but continue
      console.warn("`return_intent` is deprecated; use auto_execute_tools=false to inspect raw tool_calls.");
    }

    const toolHandler = new FunctionToolHandler(Array.from(tools ?? []));
    const logger = new DebugLogger(this.verbose ?? !!verbose, !!debug);
    logger.toolSchema(toolHandler.listNames());

    const modelSpec = this.normalizeModelSpec(model);
    const request_kwargs = this.buildRequestKwargs({
      temperature,
      max_tokens,
      top_p,
      frequency_penalty,
      presence_penalty,
      logit_bias,
      agent_attributes,
      model_attributes,
      tool_choice,
      guardrails,
      handoff_config,
    });

    const state: RunnerState = {
      model: modelSpec,
      request_kwargs,
      auto_execute_tools,
      max_steps: Math.max(1, max_steps),
      mcp_servers: Array.from(mcp_servers ?? []),
      logger,
      tool_handler: toolHandler,
      input_guardrails: Array.from(input_guardrails ?? []),
      output_guardrails: Array.from(output_guardrails ?? []),
      hooks,
      stream,
    };

    const conversationConfig = {
      ...(instructions !== undefined && { instructions }),
      ...(input !== undefined && { input }),
      ...(messages !== undefined && { messages }),
    };
    const conversation = this.initialMessages(conversationConfig);
    hooks.on_before_run?.(deepClone(conversation));
    const inputGuardrailResults = await this.runInputGuardrails(conversation, state);

    // Branch to streaming or non-streaming implementation
    if (stream) {
      return this.runStreaming(conversation, state, inputGuardrailResults);
    }

    const result = await this.runTurns(conversation, state, inputGuardrailResults);
    hooks.on_after_run?.(result);
    return result;
  }

  // ------------------------------------------------------------------
  // Core loop
  // ------------------------------------------------------------------

  private async runTurns(
    conversation: Message[],
    state: RunnerState,
    input_guardrail_results: GuardrailCheckResult[]
  ): Promise<_RunResult> {
    const history = [...conversation];
    const toolSchemas = state.tool_handler.schemas() || null;
    let final_text = "";
    const tool_results: ToolResult[] = [];
    const tools_called: string[] = [];
    const models_used: string[] = [];
    const input_results = [...input_guardrail_results];
    let output_results: GuardrailCheckResult[] = [];
    let previous_model: string | string[] | null = null;
    let steps = 0;

    while (steps < state.max_steps) {
      steps += 1;
      state.logger.step(steps, state.max_steps);
      state.logger.messagesSnapshot(history);
      state.logger.models(state.model, previous_model);

      state.hooks.on_before_model_call?.({
        model: state.model,
        messages: history,
        kwargs: state.request_kwargs,
      });

      // Debug prints to mirror Python for easier parity
      // eslint-disable-next-line no-console
      console.log(`[RUNNER DEBUG] state.mcp_servers = ${JSON.stringify(state.mcp_servers)} , type = ${typeof state.mcp_servers}`);
      // eslint-disable-next-line no-console
      console.log(`[RUNNER DEBUG] state.mcp_servers or null = ${state.mcp_servers || null}`);

      const create_params: ChatCreateArgs = {
        model: state.model,
        messages: history,
        tools: toolSchemas,
        mcp_servers: state.mcp_servers.length ? state.mcp_servers : null,
        stream: state.stream,
        ...state.request_kwargs,
      };
      // eslint-disable-next-line no-console
      console.log(`[RUNNER DEBUG] Full create() params keys: ${Object.keys(create_params)}`);
      // eslint-disable-next-line no-console
      console.log(`[RUNNER DEBUG] mcp_servers param value: ${JSON.stringify(create_params.mcp_servers)}`);

      const response = await this.client.chat.completions.create(create_params);

      let tool_calls: any[] = [];
      let content: string | undefined;

      // Handle streaming response
      if (state.stream) {
        const collected_tool_calls: any[] = [];
        const collected_content: string[] = [];

        // TypeScript streaming - response should be an async iterator
        // No printing - user should use streamAsync/streamSync from utils
        for await (const chunk of response as any) {
          if (chunk.choices) {
            const choice = chunk.choices[0];
            const delta = choice?.delta;
            if (delta) {
              // Check for tool calls in delta
              if (delta.tool_calls) {
                this.accumulateToolCalls(delta.tool_calls, collected_tool_calls);
              }

              // Check for content
              if (delta.content) {
                collected_content.push(delta.content);
              }
            }
          }
        }

        // Reconstruct response data from collected chunks
        if (collected_tool_calls.length) {
          // Categorize tools into local vs MCP
          const local_tool_names = new Set(state.tool_handler.listNames());
          const mcp_names = collected_tool_calls
            .map(tc => tc.function?.name)
            .filter(name => !local_tool_names.has(name));
          const has_streamed_content = collected_content.length > 0;

          // If MCP tools were called AND content was streamed, server handled it - we're done
          if (mcp_names.length && has_streamed_content) {
            final_text = collected_content.join('');
            if (final_text) {
              history.push({ role: "assistant", content: final_text } as unknown as Message);
            }
            break;
          }

          // Check if ALL tools are MCP (none are local)
          const all_mcp = collected_tool_calls.every(
            tc => !local_tool_names.has(tc.function?.name)
          );

          if (all_mcp) {
            // All tools are MCP - continue loop to get server's response
            tool_calls = [];
          } else {
            // We have at least one local tool - filter and process only local tools
            tool_calls = collected_tool_calls.filter(
              tc => local_tool_names.has(tc.function?.name)
            );
          }
        } else {
          // Final text response - no tool calls
          tool_calls = [];
          final_text = collected_content.join('');
          if (final_text) {
            history.push({ role: "assistant", content: final_text } as unknown as Message);
          }
          break;
        }
      } else {
        // Non-streaming response
        state.hooks.on_after_model_call?.(response);

        if (!response?.choices?.length) break;

        const choice = response.choices[0];
        const message_dict = messageToObject((choice as any).message);
        tool_calls = (message_dict['tool_calls'] as any[]) || [];
        content = message_dict['content'];

        if (!tool_calls.length) {
          final_text = content || "";
          if (final_text) {
            history.push({ role: "assistant", content: final_text } as unknown as Message);
          }
          break;
        }
      }

      models_used.push(renderModelSpec(state.model));
      previous_model = state.model;

      const tool_payloads = tool_calls.map(tc => this.coerceToolCall(tc));
      for (const payload of tool_payloads) {
        const name = payload.function?.name;
        if (name && !tools_called.includes(name)) tools_called.push(name);
      }

      history.push({ role: "assistant", tool_calls: tool_payloads } as unknown as Message);

      if (!state.auto_execute_tools) break;

      await this.executeToolCallsSync({
        tool_calls: tool_payloads,
        tool_handler: state.tool_handler,
        history,
        tool_results,
        tools_called,
        step: steps,
        logger: state.logger,
        hooks: state.hooks,
      });
    }

    if (final_text) {
      output_results = await this.runOutputGuardrails(final_text, state);
    }

    state.logger.finalSummary(models_used, tools_called);
    return new _RunResult(
      final_text,
      tool_results,
      steps,
      history,
      tools_called,
      models_used,
      input_results,
      output_results
    );
  }

  private async *runStreaming(
    conversation: Message[],
    state: RunnerState,
    input_guardrail_results: GuardrailCheckResult[]
  ): AsyncIterableIterator<any> {
    /**
     * Execute conversation with streaming - yields chunks while processing tool calls.
     */
    const history = [...conversation];
    const toolSchemas = state.tool_handler.schemas() || null;
    let previous_model: string | string[] | null = null;
    let steps = 0;

    while (steps < state.max_steps) {
      steps += 1;
      state.logger.step(steps, state.max_steps);
      state.logger.messagesSnapshot(history);
      state.logger.models(state.model, previous_model);

      state.hooks.on_before_model_call?.({
        model: state.model,
        messages: history,
        kwargs: state.request_kwargs,
      });

      // eslint-disable-next-line no-console
      console.log(`[RUNNER DEBUG] state.mcp_servers = ${JSON.stringify(state.mcp_servers)} , type = ${typeof state.mcp_servers}`);
      // eslint-disable-next-line no-console
      console.log(`[RUNNER DEBUG] state.mcp_servers or null = ${state.mcp_servers || null}`);

      const create_params: ChatCreateArgs = {
        model: state.model,
        messages: history,
        tools: toolSchemas,
        mcp_servers: state.mcp_servers.length ? state.mcp_servers : null,
        stream: true,  // Always stream
        ...state.request_kwargs,
      };
      // eslint-disable-next-line no-console
      console.log(`[RUNNER DEBUG] Full create() params keys: ${Object.keys(create_params)}`);
      // eslint-disable-next-line no-console
      console.log(`[RUNNER DEBUG] mcp_servers param value: ${JSON.stringify(create_params.mcp_servers)}`);

      const stream = await this.client.chat.completions.create(create_params);

      // Yield chunks while accumulating tool calls and content
      const collected_tool_calls: any[] = [];
      const collected_content: string[] = [];

      for await (const chunk of stream as any) {
        if (chunk.choices) {
          const choice = chunk.choices[0];
          const delta = choice?.delta;
          if (delta) {
            // Check for tool calls in delta
            if (delta.tool_calls) {
              this.accumulateToolCalls(delta.tool_calls, collected_tool_calls);
            }

            // Check for content
            if (delta.content) {
              collected_content.push(delta.content);
            }
          }
        }

        // Yield the chunk to the user
        yield chunk;
      }

      // Process accumulated data after stream ends
      if (collected_tool_calls.length) {
        // Categorize tools into local vs MCP
        const local_tool_names = new Set(state.tool_handler.listNames());
        const local_names = collected_tool_calls
          .map(tc => tc.function?.name)
          .filter(name => name && local_tool_names.has(name));
        const mcp_names = collected_tool_calls
          .map(tc => tc.function?.name)
          .filter(name => name && !local_tool_names.has(name));

        // Check if ALL tools are MCP tools (none are local)
        const all_mcp = collected_tool_calls.every(
          tc => !local_tool_names.has(tc.function?.name)
        );

        // Check if stream already contains content (MCP results)
        const has_streamed_content = collected_content.length > 0;

        // When MCP tools are involved and content was streamed, we're done
        if (mcp_names.length && has_streamed_content) {
          // eslint-disable-next-line no-console
          console.log(`[STREAMING DEBUG] MCP tools called and content streamed - response complete, breaking loop`);
          break;
        }

        if (all_mcp) {
          // All tools are MCP - the response should be streamed
          // Don't add to history - let the next iteration handle it
          // eslint-disable-next-line no-console
          console.log(`[STREAMING DEBUG] All tools are MCP, expecting streamed response`);
          continue;
        }

        // We have at least one local tool
        // Filter to only include local tool calls in the assistant message
        const local_only_tool_calls = collected_tool_calls.filter(
          tc => local_tool_names.has(tc.function?.name)
        );

        const local_payloads = local_only_tool_calls.map(tc => this.coerceToolCall(tc));
        history.push({ role: "assistant", tool_calls: local_payloads } as unknown as Message);

        // eslint-disable-next-line no-console
        console.log(
          `[STREAMING DEBUG] Added assistant message with ${local_only_tool_calls.length} local tool calls (filtered from ${collected_tool_calls.length} total)`
        );

        if (!state.auto_execute_tools) {
          break;
        }

        // Execute only local tools
        for (const tc of collected_tool_calls) {
          const name = tc.function?.name ?? "";

          if (local_tool_names.has(name)) {
            // Local tool - execute it
            const args = parseArguments(tc.function?.arguments);

            state.hooks.on_before_tool?.(name, args);
            try {
              const result = await state.tool_handler.exec(name, args);
              history.push({
                role: "tool",
                tool_call_id: tc.id ?? "",
                content: jsonify(result),
              } as unknown as Message);
              state.logger.toolExecution(name, result);
              state.hooks.on_after_tool?.(name, result as JsonValue);
              // eslint-disable-next-line no-console
              console.log(`[STREAMING DEBUG] Executed local tool ${name}: ${String(result).slice(0, 50)}...`);
            } catch (error: any) {
              history.push({
                role: "tool",
                tool_call_id: tc.id ?? "",
                content: `Error: ${String(error?.message ?? error)}`,
              } as unknown as Message);
              state.logger.toolExecution(name, error, true);
              state.hooks.on_after_tool?.(name, error);
              // eslint-disable-next-line no-console
              console.log(`[STREAMING DEBUG] Error executing local tool ${name}: ${error}`);
            }
          } else {
            // MCP tool - DON'T add any message, server will handle
            // eslint-disable-next-line no-console
            console.log(`[STREAMING DEBUG] MCP tool ${name} - skipping (server will handle)`);
          }
        }
      } else {
        // Final text response - no tool calls, we're done
        break;
      }

      previous_model = state.model;
    }
  }

  // ------------------------------------------------------------------
  // Tool call accumulation for streaming
  // ------------------------------------------------------------------

  private accumulateToolCalls(deltas: any[], acc: any[]): void {
    /**
     * Accumulate streaming tool call deltas into complete tool calls.
     */
    for (const delta of deltas) {
      const index = delta.index ?? 0;

      // Ensure we have enough entries in acc
      while (acc.length <= index) {
        acc.push({ id: "", type: "function", function: { name: "", arguments: "" } });
      }

      if (delta.id) {
        acc[index].id = delta.id;
      }
      if (delta.function) {
        const fn = delta.function;
        if (fn.name) {
          acc[index].function.name = fn.name;
        }
        if (fn.arguments) {
          acc[index].function.arguments += fn.arguments;
        }
      }
    }
  }

  // ------------------------------------------------------------------
  // Guardrails
  // ------------------------------------------------------------------

  private async runInputGuardrails(
    conversation: Message[],
    state: RunnerState
  ): Promise<GuardrailCheckResult[]> {
    if (!state.input_guardrails.length) return [];
    const snapshot = deepClone(conversation);
    const results: GuardrailCheckResult[] = [];
    for (const guardrail of state.input_guardrails) {
      const result = await this.invokeGuardrail(guardrail, snapshot);
      if (result.tripwire_triggered) {
        state.logger.log(`Input guardrail triggered: ${this.guardrailName(guardrail)}`);
        state.hooks.on_guardrail_trigger?.(this.guardrailName(guardrail), result);
        throw new InputGuardrailTriggered(result);
      }
      results.push(result);
    }
    return results;
  }

  private async runOutputGuardrails(final_output: string, state: RunnerState): Promise<GuardrailCheckResult[]> {
    if (!state.output_guardrails.length) return [];
    const results: GuardrailCheckResult[] = [];
    for (const guardrail of state.output_guardrails) {
      const result = await this.invokeGuardrail(guardrail, final_output);
      if (result.tripwire_triggered) {
        state.logger.log(`Output guardrail triggered: ${this.guardrailName(guardrail)}`);
        state.hooks.on_guardrail_trigger?.(this.guardrailName(guardrail), result);
        throw new OutputGuardrailTriggered(result);
      }
      results.push(result);
    }
    return results;
  }

  private async invokeGuardrail(guardrail: GuardrailFunc, payload: any): Promise<GuardrailCheckResult> {
    let outcome = await Promise.resolve(guardrail(payload));

    if (outcome instanceof GuardrailCheckResult) return outcome;

    if (outcome && typeof outcome === "object" && "tripwire_triggered" in outcome) {
      return new GuardrailCheckResult(Boolean((outcome as any).tripwire_triggered), (outcome as any).info);
    }

    if (Array.isArray(outcome) && outcome.length) {
      const [triggered, info] = outcome as any[];
      return new GuardrailCheckResult(Boolean(triggered), info);
    }

    if (outcome == null) return new GuardrailCheckResult(false, null);
    return new GuardrailCheckResult(Boolean(outcome), null);
  }

  private guardrailName(guardrail: GuardrailFunc): string {
    return (guardrail as any)._guardrail_name ?? (guardrail as any).name ?? "guardrail";
    }

  // ------------------------------------------------------------------
  // Message/setup helpers
  // ------------------------------------------------------------------

  private initialMessages({
    instructions,
    input,
    messages,
  }: {
    instructions?: string;
    input?: string | Message[];
    messages?: Message[];
  }): Message[] {
    if (instructions && messages?.some(m => (m as any).role === "system")) {
      throw new Error("Cannot supply both 'instructions' and a system message in 'messages'.");
    }

    let conversation: Message[] = [];
    if (messages) {
      conversation = [...messages];
    } else if (typeof input === "string") {
      conversation = [{ role: "user", content: input } as unknown as Message];
    } else if (Array.isArray(input)) {
      conversation = [...input];
    }

    if (instructions) {
      conversation.unshift({ role: "system", content: instructions } as unknown as Message);
    }

    if (!conversation.length) {
      throw new Error("Must supply one of instructions/messages/input");
    }
    return conversation;
  }

  private buildRequestKwargs(kwargs: Record<string, any>): Record<string, any> {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(kwargs)) {
      if (v !== undefined && v !== null) out[k] = v;
    }
    return out;
  }

  private normalizeModelSpec(
    model: string | string[] | { name: string } | Iterable<{ name: string }>
  ): string | string[] {
    if (typeof model === "string") return model;
    if (Array.isArray(model)) return model;

    if (Symbol.iterator in Object(model)) {
      const models = Array.from(model as Iterable<{ name: string }>).map(m => this.modelName(m));
      if (!models.length) throw new Error("Model list cannot be empty");
      return models;
    }
    return this.modelName(model as any);
  }

  private modelName(model: any): string {
    if (model && typeof model === "object" && "name" in model) return String(model.name);
    if (typeof model === "string") return model;
    throw new TypeError("Model must be a string, a DedalusModel-like object, or an iterable of either");
  }

  private coerceToolCall(call: any): any {
    const data = messageToObject(call);
    const fn = messageToObject(data['function'] ?? {});
    let argumentsStr = fn['arguments'] ?? "{}";
    if (typeof argumentsStr !== "string") {
      try { argumentsStr = JSON.stringify(argumentsStr); } catch { argumentsStr = "{}"; }
    }
    return {
      id: data['id'] ?? "",
      type: data['type'] ?? "function",
      function: {
        name: fn['name'] ?? "",
        arguments: argumentsStr,
      },
    };
  }

  private async executeToolCallsSync({
    tool_calls,
    tool_handler,
    history,
    tool_results,
    tools_called,
    step,
    logger,
    hooks,
  }: {
    tool_calls: Array<any>;
    tool_handler: FunctionToolHandler;
    history: Message[];
    tool_results: ToolResult[];
    tools_called: string[];
    step: number;
    logger: DebugLogger;
    hooks: RunnerHooks;
  }): Promise<void> {
    for (const tc of tool_calls) {
      const name = tc.function?.name ?? "";
      const args = parseArguments(tc.function?.arguments);

      hooks.on_before_tool?.(name, args);
      try {
        const result = await tool_handler.exec(name, args);
        tool_results.push({ name, result, step });
        if (!tools_called.includes(name)) tools_called.push(name);
        history.push({
          role: "tool",
          tool_call_id: tc.id ?? "",
          content: jsonify(result),
        } as unknown as Message);
        logger.toolExecution(name, result);
        hooks.on_after_tool?.(name, result as JsonValue);
      } catch (error: any) {
        tool_results.push({ name, error: String(error?.message ?? error), step });
        history.push({
          role: "tool",
          tool_call_id: tc.id ?? "",
          content: `Error: ${String(error?.message ?? error)}`,
        } as unknown as Message);
        logger.toolExecution(name, error, true);
        hooks.on_after_tool?.(name, error);
      }
    }
  }
}

export const __all__ = ["DedalusRunner", "RunnerHooks"];