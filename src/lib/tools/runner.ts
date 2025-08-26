// ==============================================================================
//                  © 2025 Dedalus Labs, Inc. and affiliates
//                            Licensed under MIT
//           github.com/dedalus-labs/dedalus-labs-python-sdk/LICENSE
// ==============================================================================

import {
  JsonValue,
  MessageDict,
  ToolCall,
  ToolResult,
  PolicyContext,
  PolicyInput,
  PolicyResultShape,
  ToolJSONSchema,
  ToolHandler,
  ModelConfig,
  ExecutionConfig,
  RunResult,
  ChatChoice,
  ChatCompletionChunk,
  ToolCallDelta,
  DedalusLikeClient,
} from "./runner-types";


function processPolicy(
  policy: PolicyInput,
  context: PolicyContext
): Record<string, any> {
  if (!policy) return {};
  try {
    if (typeof policy === "function") {
      const r = policy(context);
      return r && typeof r === "object" ? { ...r } : {};
    }
    if (typeof policy === "object") {
      return { ...policy };
    }
  } catch (_) {}
  return {};
}


export type { ToolJSONSchema };

function parseParamNames(fn: Function): string[] {
  const src = fn.toString();
  const m = src.match(/^[\s\S]*?\(([^)]*)\)/);
  if (!m) return [];
  const inside = m[1]?.trim() ?? "";
  if (!inside) return [];
  return inside
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.replace(/\s*=\s*[\s\S]+$/, ""))
    .map((s) => s.replace(/^\{\s*|\s*\}$/g, ""))
    .map((s) => s.replace(/^\[\s*|\s*\]$/g, ""))
    .filter((s) => /[A-Za-z_$][A-Za-z0-9_$]*/.test(s));
}

export function toSchema(fn: Function): ToolJSONSchema {
  try {
    const params = parseParamNames(fn);
    const properties: Record<string, any> = {};
    for (const p of params) properties[p] = { type: "string" };
    const parameters = {
      type: "object",
      properties,
      additionalProperties: false,
      required: params,
    };
    return {
      type: "function",
      function: {
        name: fn.name || "anonymous_tool",
        description: (fn as any).description || `Execute ${fn.name || "tool"}`,
        parameters,
      },
    };
  } catch (_) {
    return {
      type: "function",
      function: {
        name: fn.name || "anonymous_tool",
        description: (fn as any).description || `Execute ${fn.name || "tool"}`,
        parameters: { type: "object", properties: {} },
      },
    };
  }
}


export class FunctionToolHandler implements ToolHandler {
  private funcs: Record<string, Function>;
  private schemasCache: ToolJSONSchema[];

  constructor(funcs: Function[] = [], explicitSchemas?: ToolJSONSchema[]) {
    this.funcs = Object.fromEntries(funcs.map((f) => [f.name, f]));
    this.schemasCache = explicitSchemas ?? funcs.map((f) => toSchema(f));
  }

  schemas(): ToolJSONSchema[] {
    return this.schemasCache;
  }

  async exec(name: string, args: Record<string, JsonValue>): Promise<JsonValue> {
    const fn = this.funcs[name];
    if (!fn) throw new Error(`Unknown tool: ${name}`);

    try {
      const out = fn(...mapArgs(fn, args));
      return await Promise.resolve(out as any);
    } catch (e: any) {
      throw e instanceof Error ? e : new Error(String(e));
    }
  }
}

function mapArgs(fn: Function, named: Record<string, JsonValue>): any[] {
  const names = parseParamNames(fn);
  if (!names.length) return [named];
  return names.map((n) => (n in named ? (named as any)[n] : undefined));
}


class RunResultImpl implements RunResult {
  constructor(
    public final_output: string,
    public tool_results: ToolResult[],
    public steps_used: number,
    public tools_called: string[],
    public intents: Record<string, JsonValue>[] | null = null
  ) {}
  get output() { return this.final_output; }
  get content() { return this.final_output; }
}


export type RunnerRunParams = {
  input: string;
  tools?: Function[];
  model: string | string[];
  max_steps?: number;
  mcp_servers?: string[];
  temperature?: number | null;
  max_tokens?: number | null;
  top_p?: number | null;
  frequency_penalty?: number | null;
  presence_penalty?: number | null;
  logit_bias?: Record<string, number> | null;
  stream?: boolean;
  transport?: "http" | "realtime";
  verbose?: boolean;
  debug?: boolean;
  on_tool_event?: (evt: Record<string, JsonValue>) => void;
  return_intent?: boolean;
  agent_attributes?: Record<string, number> | null;
  model_attributes?: Record<string, Record<string, number>> | null;
  tool_choice?: string | Record<string, JsonValue> | null;
  guardrails?: Record<string, JsonValue>[] | null;
  handoff_config?: Record<string, JsonValue> | null;
  policy?: PolicyInput;
  available_models?: string[];
  strict_models?: boolean;
};

export default class DedalusRunner {
  constructor(private client: DedalusLikeClient, private verbose = false) {}

  run(params: RunnerRunParams): Promise<RunResult> {
    const {
      input,
      tools = [],
      model,
      max_steps = 10,
      mcp_servers = [],
      temperature = null,
      max_tokens = null,
      top_p = null,
      frequency_penalty = null,
      presence_penalty = null,
      logit_bias = null,
      stream = false,
      transport = "http",
      verbose,
      debug = false,
      on_tool_event,
      return_intent = false,
      agent_attributes = null,
      model_attributes = null,
      tool_choice = null,
      guardrails = null,
      handoff_config = null,
      policy,
      available_models,
      strict_models = true,
    } = params;

    if (!model) throw new Error("model must be provided");
    let primaryModel: string;
    let available: string[] = [];
    if (Array.isArray(model)) {
      if (!model.length) throw new Error("model list cannot be empty");
      primaryModel = String(model[0]);
      available = model.slice();
    } else {
      primaryModel = String(model);
      available = available_modelsOrDefault(available_models, primaryModel);
    }

    const modelConfig: ModelConfig = {
      id: primaryModel,
      temperature: nullishToNull(temperature),
      max_tokens: nullishToNull(max_tokens),
      top_p: nullishToNull(top_p),
      frequency_penalty: nullishToNull(frequency_penalty),
      presence_penalty: nullishToNull(presence_penalty),
      logit_bias: nullishToNull(logit_bias),
      agent_attributes: nullishToNull(agent_attributes),
      model_attributes: nullishToNull(model_attributes),
      tool_choice: nullishToNull(tool_choice),
      guardrails: nullishToNull(guardrails),
      handoff_config: nullishToNull(handoff_config),
    };

    const execConfig: ExecutionConfig = {
      mcp_servers: mcp_servers ?? [],
      max_steps,
      stream,
      transport,
      verbose: typeof verbose === "boolean" ? verbose : this.verbose,
      debug: !!debug,
      on_tool_event: on_tool_event ?? (() => {}),
      return_intent,
      policy,
      available_models: available_models ?? available,
      strict_models,
    };

    const toolHandler = new FunctionToolHandler(tools);

    return this.executeConversation(input, toolHandler, modelConfig, execConfig);
  }

  private executeConversation(
    inputText: string,
    toolHandler: ToolHandler,
    modelConfig: ModelConfig,
    execConfig: ExecutionConfig
  ): Promise<RunResult> {
    if (execConfig.stream) {
      return this.executeStreamingAndPrint(inputText, toolHandler, modelConfig, execConfig);
    } else {
      return this.executeTurns(inputText, toolHandler, modelConfig, execConfig);
    }
  }

  private _extractTextFromChunk(chunk: any): string {
    const choice = chunk?.choices?.[0];
    const delta = choice?.delta;

    if (delta) {
      if (typeof delta.content === 'string') return delta.content;
      if (Array.isArray(delta.content)) {
        return delta.content
          .map((p: any) => (typeof p === 'string' ? p : (typeof p?.text === 'string' ? p.text : '')))
          .join('');
      }
    }

    const msg = choice?.message?.content;
    if (typeof msg === 'string') return msg;
    if (Array.isArray(msg)) {
      return msg
        .map((p: any) => (typeof p === 'string' ? p : (typeof p?.text === 'string' ? p.text : '')))
        .join('');
    }

    return '';
  }

  private async executeStreamingAndPrint(
    inputText: string,
    toolHandler: ToolHandler,
    modelConfig: ModelConfig,
    execConfig: ExecutionConfig
  ): Promise<RunResult> {
    const messages: MessageDict[] = [{ role: "user", content: inputText }];
    let steps = 0;
    let finalText = "";
    const toolResults: ToolResult[] = [];
    const toolsCalled: string[] = [];

    while (steps < execConfig.max_steps) {
      steps += 1;

      const policyResult = this.applyPolicy(
        execConfig.policy,
        {
          step: steps,
          messages,
          model: modelConfig.id,
          mcp_servers: execConfig.mcp_servers,
          tools: listLocalToolNames(toolHandler),
          available_models: execConfig.available_models,
        },
        modelConfig,
        execConfig
      );

      const currentMessages = this.buildMessages(
        messages,
        policyResult.prepend,
        policyResult.append
      );

      const streamAny = await this.client.chat.completions.create({
        model: policyResult.model_id,
        messages: currentMessages,
        tools: toolHandler.schemas().length ? toolHandler.schemas() : undefined,
        mcp_servers: policyResult.mcp_servers,
        stream: true,
        ...this.mkKwargs(modelConfig),
        ...policyResult.model_kwargs,
      } as any);

      const stream: AsyncIterable<any> = (streamAny as any)[Symbol.asyncIterator]
        ? (streamAny as AsyncIterable<any>)
        : (streamAny as any);

      let stepText = "";
      let contentChunks = 0;
      const accumulatedToolCalls: Partial<ToolCall>[] = [];
      let sawFinish = false;

      for await (const chunk of stream) {
        const piece = this._extractTextFromChunk(chunk);
        if (piece) {
          contentChunks += 1;
          stepText += piece;
          if (typeof process !== "undefined" && process.stdout?.write) {
            process.stdout.write(piece);
          }
        }

        const delta = chunk?.choices?.[0]?.delta;
        if (delta?.tool_calls && Array.isArray(delta.tool_calls)) {
          for (const tcd of delta.tool_calls) {
            const index = typeof tcd.index === "number" ? tcd.index : 0;
            while (accumulatedToolCalls.length <= index) {
              accumulatedToolCalls.push({});
            }
            const acc = accumulatedToolCalls[index]!;
            if (tcd.id) acc.id = tcd.id;
            if (tcd.type) acc.type = tcd.type as any;
            if (tcd.function) {
              if (!acc.function) acc.function = { name: "", arguments: "" } as any;
              const fn = acc.function!;
              if (tcd.function.name) fn.name += tcd.function.name;
              if (tcd.function.arguments) fn.arguments += tcd.function.arguments;
            }
          }
        }

        const fr = chunk?.choices?.[0]?.finish_reason;
        if (fr) sawFinish = true;
      }

      if (stepText && process.stdout?.write) process.stdout.write("\n");

      const toolCalls: ToolCall[] = accumulatedToolCalls
        .filter(tc => tc.id && tc.function?.name)
        .map(tc => ({ ...(tc as ToolCall) }));

      if (stepText) finalText += stepText;

      if (toolCalls.length) {
        const localNames = new Set(toolHandler.schemas().map(s => s.function.name));
        const localToolCalls = toolCalls.filter(tc => localNames.has(tc.function.name));
        const mcpToolCalls = toolCalls.filter(tc => !localNames.has(tc.function.name));

        if (mcpToolCalls.length > 0 && localToolCalls.length === 0 && contentChunks > 0) {
          break;
        }

        if (localToolCalls.length > 0) {
          messages.push({ role: "assistant", tool_calls: localToolCalls });

          await this.executeToolCalls(
            localToolCalls,
            toolHandler,
            messages,
            toolResults,
            toolsCalled,
            steps,
            execConfig.verbose
          );

          continue;
        }

        continue;
      }

      break;
    }

    return this.createRunResult(finalText, toolResults, steps, toolsCalled);
  }

  private createRunResult(
    finalText: string, 
    toolResults: ToolResult[], 
    steps: number, 
    toolsCalled: string[]
  ): RunResult {
    return new RunResultImpl(finalText, toolResults, steps, toolsCalled);
  }

  private async executeTurns(
    inputText: string,
    toolHandler: ToolHandler,
    modelConfig: ModelConfig,
    execConfig: ExecutionConfig
  ): Promise<RunResult> {
    const messages: MessageDict[] = [{ role: "user", content: inputText }];
    let steps = 0;
    let finalText = "";
    const toolResults: ToolResult[] = [];
    const toolsCalled: string[] = [];

    while (steps < execConfig.max_steps) {
      steps += 1;
  
      const policyResult = this.applyPolicy(
        execConfig.policy,
        {
          step: steps,
          messages,
          model: modelConfig.id,
          mcp_servers: execConfig.mcp_servers,
          tools: listLocalToolNames(toolHandler),
          available_models: execConfig.available_models,
        },
        modelConfig,
        execConfig
      );

      const currentMessages = this.buildMessages(messages, policyResult.prepend, policyResult.append);

      const response: any = await this.client.chat.completions.create({
        model: policyResult.model_id,
        messages: currentMessages,
        tools: toolHandler.schemas().length ? toolHandler.schemas() : undefined,
        mcp_servers: policyResult.mcp_servers,
        ...this.mkKwargs(modelConfig),
        ...policyResult.model_kwargs,
      } as any);

      if (!response || !Array.isArray(response.choices) || !response.choices.length) {
        finalText = "";
        break;
      }

      const message = response.choices[0].message as any;
      const toolCalls = message?.tool_calls as ToolCall[] | undefined;
      const content = (message?.content ?? "") as string;

      if (!toolCalls || !toolCalls.length) {
        finalText = content || "";
        break;
      }

      const calls = this.extractToolCalls(response.choices[0]);
      await this.executeToolCalls(calls, toolHandler, messages, toolResults, toolsCalled, steps, execConfig.verbose);
    }

    return this.createRunResult(finalText, toolResults, steps, toolsCalled);
  }

  private async *executeStreaming(
    inputText: string,
    toolHandler: ToolHandler,
    modelConfig: ModelConfig,
    execConfig: ExecutionConfig
  ): AsyncIterable<ChatCompletionChunk> {
    const messages: MessageDict[] = [{ role: "user", content: inputText }];
    let steps = 0;

    while (steps < execConfig.max_steps) {
      steps += 1;

      const policyResult = this.applyPolicy(
        execConfig.policy,
        {
          step: steps,
          messages,
          model: modelConfig.id,
          mcp_servers: execConfig.mcp_servers,
          tools: listLocalToolNames(toolHandler),
          available_models: execConfig.available_models,
        },
        modelConfig,
        execConfig
      );

      const currentMessages = this.buildMessages(messages, policyResult.prepend, policyResult.append);

      const streamAny = await this.client.chat.completions.create({
        model: policyResult.model_id,
        messages: currentMessages,
        tools: toolHandler.schemas().length ? toolHandler.schemas() : undefined,
        mcp_servers: policyResult.mcp_servers,
        stream: true,
        ...this.mkKwargs(modelConfig),
        ...policyResult.model_kwargs,
      } as any);

      const stream: AsyncIterable<ChatCompletionChunk> = isAsyncIterable(streamAny)
        ? streamAny
        : (streamAny as any);

      const toolCalls: ToolCall[] = [];
      let contentChunks = 0;

      for await (const chunk of stream) {
        const choice = (chunk as any)?.choices?.[0];
        const delta = choice?.delta;
        if (delta?.tool_calls?.length) this.accumulateToolCalls(delta.tool_calls, toolCalls);
        if (delta?.content) contentChunks += 1;
        yield chunk;
      }

      if (toolCalls.length) {
        const localNames = new Set(listLocalToolNames(toolHandler));
        const localOnly = toolCalls.filter((tc) => localNames.has(tc.function.name));

        if (localOnly.length) {
          messages.push({ role: "assistant", tool_calls: localOnly });
          for (const tc of localOnly) {
            const fnName = tc.function.name;
            let fnArgs: Record<string, JsonValue> = {};
            try { fnArgs = JSON.parse(tc.function.arguments || "{}"); } catch { fnArgs = {}; }
            try {
              const result = await toolHandler.exec(fnName, fnArgs);
              messages.push({ role: "tool", tool_call_id: tc.id, content: String(result) });
            } catch (e: any) {
              messages.push({ role: "tool", tool_call_id: tc.id, content: `Error: ${String(e?.message || e)}` });
            }
          }
          continue;
        }

        if (contentChunks > 0) break;
        continue;
      }

      break;
    }
  }


  private applyPolicy(
    policy: PolicyInput | undefined,
    context: PolicyContext,
    modelConfig: ModelConfig,
    execConfig: ExecutionConfig
  ): {
    model_id: string;
    mcp_servers: string[];
    model_kwargs: Record<string, unknown>;
    prepend: MessageDict[];
    append: MessageDict[];
  } {
    const pol = processPolicy(policy ?? null, context) as PolicyResultShape | Record<string, any>;

    const result = {
      model_id: modelConfig.id,
      mcp_servers: [...execConfig.mcp_servers],
      model_kwargs: {} as Record<string, unknown>,
      prepend: [] as MessageDict[],
      append: [] as MessageDict[],
    };

    if (pol && typeof pol === "object") {
      const requestedModel = (pol as any).model as string | undefined;
      if (requestedModel) {
        if (execConfig.strict_models && execConfig.available_models?.length) {
          if (execConfig.available_models.includes(requestedModel)) {
            result.model_id = String(requestedModel);
          } else if (execConfig.verbose) {
          }
        } else {
          result.model_id = String(requestedModel);
        }
      }

      result.mcp_servers = ((pol as any).mcp_servers ?? result.mcp_servers) as string[];
      result.model_kwargs = { ...(pol as any).model_settings };
      result.prepend = ((pol as any).message_prepend ?? []) as MessageDict[];
      result.append = ((pol as any).message_append ?? []) as MessageDict[];

      const maxSteps = (pol as any).max_steps;
      if (typeof maxSteps === "number" && Number.isFinite(maxSteps)) {
        execConfig.max_steps = maxSteps;
      }
    }

    return result;
  }

  private buildMessages(
    messages: MessageDict[],
    prepend: MessageDict[] = [],
    append: MessageDict[] = []
  ): MessageDict[] {
    return prepend.length || append.length ? [...prepend, ...messages, ...append] : messages;
  }

  private extractToolCalls(choice: ChatChoice): ToolCall[] {
    const message = (choice as any)?.message as any;
    const toolCalls = (message?.tool_calls ?? []) as any[];
    if (!Array.isArray(toolCalls) || !toolCalls.length) return [];
    const calls: ToolCall[] = [];
    for (const tc of toolCalls) {
      const fn = tc?.function ?? {};
      calls.push({
        id: String(tc?.id ?? ""),
        type: (tc?.type ?? "function") as any,
        function: {
          name: String(fn?.name ?? ""),
          arguments: String(fn?.arguments ?? "{}"),
        },
      });
    }
    return calls;
  }

  private async executeToolCalls(
    toolCalls: ToolCall[],
    toolHandler: ToolHandler,
    messages: MessageDict[],
    toolResults: ToolResult[],
    toolsCalled: string[],
    step: number,
    verbose = false
  ): Promise<void> {
    const localSchemaNames = new Set(toolHandler.schemas().map(schema => schema.function.name));
    const localToolCalls: ToolCall[] = [];
    const mcpToolCalls: ToolCall[] = [];
    
    for (const tc of toolCalls) {
      const fnName = tc.function.name;
      if (localSchemaNames.has(fnName)) {
        localToolCalls.push(tc);
      } else {
        mcpToolCalls.push(tc);
      }
    }

    if (localToolCalls.length > 0) {
      const last = messages[messages.length - 1];
      const alreadyHasToolCalls =
        last?.role === "assistant" && Array.isArray((last as any).tool_calls) && (last as any).tool_calls.length > 0;
      if (!alreadyHasToolCalls) {
        messages.push({ role: "assistant", tool_calls: localToolCalls });
      }

      for (const tc of localToolCalls) {
        const fnName = tc.function.name;
        let fnArgs: Record<string, JsonValue> = {};
        try { 
          fnArgs = JSON.parse(tc.function.arguments || "{}"); 
        } catch { 
          fnArgs = {}; 
        }

        try {
          const result = await toolHandler.exec(fnName, fnArgs);
          toolResults.push({ name: fnName, result, step });
          toolsCalled.push(fnName);
          messages.push({ role: "tool", tool_call_id: tc.id, content: String(result) });
        } catch (e: any) {
          const err = { error: String(e?.message || e), name: fnName, step } as ToolResult;
          toolResults.push(err);
          messages.push({ role: "tool", tool_call_id: tc.id, content: `Error: ${err.error}` });
        }
      }
    }
    
  }

  private accumulateToolCalls(deltas: ToolCallDelta[], acc: ToolCall[]): void {
    for (const delta of deltas) {
      const index = typeof delta.index === "number" ? delta.index : 0;
      while (acc.length <= index) {
        acc.push({ id: "", type: "function", function: { name: "", arguments: "" } });
      }
      const item = acc[index];
      if (item && delta.id) item.id = delta.id;
      if (item && delta.function) {
        const fn = delta.function;
        if (fn.name) item.function.name = fn.name;
        if (fn.arguments) item.function.arguments += fn.arguments;
      }
    }
  }

  private mkKwargs(mc: ModelConfig): Record<string, unknown> {
    const { id, ...rest } = mc;
    return Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== null && v !== undefined));
  }
}


function nullishToNull<T>(v: T | null | undefined): T | null {
  return v === null || v === undefined ? null : v;
}

function isAsyncIterable<T>(obj: any): obj is AsyncIterable<T> {
  return obj && typeof obj[Symbol.asyncIterator] === "function";
}

function listLocalToolNames(toolHandler: ToolHandler): string[] {
  const schemas = toolHandler.schemas();
  return schemas.map((s) => s?.function?.name).filter((n): n is string => !!n);
}

function available_modelsOrDefault(avail: string[] | undefined, model: string): string[] {
  if (Array.isArray(avail) && avail.length) return avail.slice();
  return [model];
}