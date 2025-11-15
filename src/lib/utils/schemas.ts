// ==============================================================================
//                  © 2025 Dedalus Labs, Inc. and affiliates
//                            Licensed under MIT
//           github.com/dedalus-labs/dedalus-sdk-typescript/LICENSE
// ==============================================================================

/**
 * TS note:
 * We can't reflect full static types at runtime like Python+pydantic.
 * This helper best-effort extracts parameter names and builds a minimal,
 * OpenAPI-compatible JSON schema. You can pass richer schema later if needed.
 */

export type JSONSchema = {
  type: 'object';
  properties: Record<string, any>;
  required?: string[];
  additionalProperties?: boolean;
};

export function toSchema(
  func: Function,
  opts?: {
    /** Optional override for description (falls back to JSDoc or "Execute <name>") */
    description?: string;
    /** Optional complete parameters schema to use instead of auto-generated */
    parameters?: JSONSchema;
  },
): { type: 'function'; function: { name: string; description: string; parameters: JSONSchema } } {
  try {
    const name = (func as any).name || 'anonymous';
    const description =
      opts?.description ||
      // try to read a JSDoc string (not reliable at runtime; kept for symmetry)
      ((func as any).description as string | undefined) ||
      `Execute ${name}`;

    // If caller provides a schema, honor it entirely.
    if (opts?.parameters) {
      return {
        type: 'function',
        function: { name, description, parameters: opts.parameters },
      };
    }

    // Heuristic: extract parameter names from function source.
    const src = Function.prototype.toString.call(func);
    const match = src.match(/^[^(]*\(\s*([^)]*)\)/);
    const params =
      match?.[1] ?
        match[1]
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          // strip default values and rest/spread
          .map((s) =>
            s
              .replace(/=.*$/, '')
              .replace(/^[.\s]*\.\.\./, '')
              .trim(),
          )
      : [];

    const properties: Record<string, any> = {};
    const required: string[] = [];

    if (params.length === 0) {
      // Match Python fallback: single required "input" string
      properties['input'] = { type: 'string' };
      required.push('input');
    } else {
      for (const p of params) {
        // Without runtime type info, default each param to string
        properties[p] = { type: 'string' };
        required.push(p);
      }
    }

    const schema: JSONSchema = {
      type: 'object',
      properties,
      required,
      additionalProperties: false,
    };

    return {
      type: 'function',
      function: { name, description, parameters: schema },
    };
  } catch {
    const name = (func as any)?.name || 'anonymous';
    return {
      type: 'function',
      function: {
        name,
        description: `Execute ${name}`,
        parameters: { type: 'object', properties: {} },
      },
    };
  }
}
