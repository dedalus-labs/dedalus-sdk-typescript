// ==============================================================================
//                  © 2025 Dedalus Labs, Inc. and affiliates
//                            Licensed under MIT
//           github.com/dedalus-labs/dedalus-sdk-python/LICENSE
// ==============================================================================

export class GuardrailCheckResult {
    constructor(public tripwire_triggered: boolean, public info: any = null) {}
  }
  
  export type GuardrailFunc = (payload: any) =>
    | GuardrailCheckResult
    | boolean
    | null
    | Promise<GuardrailCheckResult | boolean | null>;
  
  export class InputGuardrailTriggered extends Error {
    constructor(public result: GuardrailCheckResult) {
      super("Input guardrail tripwire triggered");
      this.name = "InputGuardrailTriggered";
    }
  }
  
  export class OutputGuardrailTriggered extends Error {
    constructor(public result: GuardrailCheckResult) {
      super("Output guardrail tripwire triggered");
      this.name = "OutputGuardrailTriggered";
    }
  }
  
  /**
   * Decorator-like helper. In TS (without experimental decorators),
   * we annotate the function by attaching a `_guardrail_name` property.
   */
  export function inputGuardrail(
    fn?: GuardrailFunc,
    opts?: { name?: string }
  ):
    | GuardrailFunc
    | ((inner: GuardrailFunc) => GuardrailFunc) {
    const apply = (inner: GuardrailFunc) => {
      (inner as any)._guardrail_name = opts?.name ?? (inner as any).name ?? "input_guardrail";
      return inner;
    };
    return fn ? apply(fn) : apply;
  }
  
  export function outputGuardrail(
    fn?: GuardrailFunc,
    opts?: { name?: string }
  ):
    | GuardrailFunc
    | ((inner: GuardrailFunc) => GuardrailFunc) {
    const apply = (inner: GuardrailFunc) => {
      (inner as any)._guardrail_name = opts?.name ?? (inner as any).name ?? "output_guardrail";
      return inner;
    };
    return fn ? apply(fn) : apply;
  }
  