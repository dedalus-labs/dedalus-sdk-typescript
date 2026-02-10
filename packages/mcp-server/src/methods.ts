import { McpOptions } from './options';

export type SdkMethod = {
  clientCallName: string;
  fullyQualifiedName: string;
  httpMethod?: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'query';
  httpPath?: string;
};

export const sdkMethods: SdkMethod[] = [
  {
    clientCallName: 'client.models.retrieve',
    fullyQualifiedName: 'models.retrieve',
    httpMethod: 'get',
    httpPath: '/v1/models/{model_id}',
  },
  {
    clientCallName: 'client.models.list',
    fullyQualifiedName: 'models.list',
    httpMethod: 'get',
    httpPath: '/v1/models',
  },
  {
    clientCallName: 'client.embeddings.create',
    fullyQualifiedName: 'embeddings.create',
    httpMethod: 'post',
    httpPath: '/v1/embeddings',
  },
  {
    clientCallName: 'client.audio.speech.create',
    fullyQualifiedName: 'audio.speech.create',
    httpMethod: 'post',
    httpPath: '/v1/audio/speech',
  },
  {
    clientCallName: 'client.audio.transcriptions.create',
    fullyQualifiedName: 'audio.transcriptions.create',
    httpMethod: 'post',
    httpPath: '/v1/audio/transcriptions',
  },
  {
    clientCallName: 'client.audio.translations.create',
    fullyQualifiedName: 'audio.translations.create',
    httpMethod: 'post',
    httpPath: '/v1/audio/translations',
  },
  {
    clientCallName: 'client.images.createVariation',
    fullyQualifiedName: 'images.createVariation',
    httpMethod: 'post',
    httpPath: '/v1/images/variations',
  },
  {
    clientCallName: 'client.images.edit',
    fullyQualifiedName: 'images.edit',
    httpMethod: 'post',
    httpPath: '/v1/images/edits',
  },
  {
    clientCallName: 'client.images.generate',
    fullyQualifiedName: 'images.generate',
    httpMethod: 'post',
    httpPath: '/v1/images/generations',
  },
  {
    clientCallName: 'client.ocr.process',
    fullyQualifiedName: 'ocr.process',
    httpMethod: 'post',
    httpPath: '/v1/ocr',
  },
  {
    clientCallName: 'client.responses.create',
    fullyQualifiedName: 'responses.create',
    httpMethod: 'post',
    httpPath: '/v1/responses',
  },
  {
    clientCallName: 'client.chat.completions.create',
    fullyQualifiedName: 'chat.completions.create',
    httpMethod: 'post',
    httpPath: '/v1/chat/completions',
  },
];

function allowedMethodsForCodeTool(options: McpOptions | undefined): SdkMethod[] | undefined {
  if (!options) {
    return undefined;
  }

  let allowedMethods: SdkMethod[];

  if (options.codeAllowHttpGets || options.codeAllowedMethods) {
    // Start with nothing allowed and then add into it from options
    let allowedMethodsSet = new Set<SdkMethod>();

    if (options.codeAllowHttpGets) {
      // Add all methods that map to an HTTP GET
      sdkMethods
        .filter((method) => method.httpMethod === 'get')
        .forEach((method) => allowedMethodsSet.add(method));
    }

    if (options.codeAllowedMethods) {
      // Add all methods that match any of the allowed regexps
      const allowedRegexps = options.codeAllowedMethods.map((pattern) => {
        try {
          return new RegExp(pattern);
        } catch (e) {
          throw new Error(
            `Invalid regex pattern for allowed method: "${pattern}": ${e instanceof Error ? e.message : e}`,
          );
        }
      });

      sdkMethods
        .filter((method) => allowedRegexps.some((regexp) => regexp.test(method.fullyQualifiedName)))
        .forEach((method) => allowedMethodsSet.add(method));
    }

    allowedMethods = Array.from(allowedMethodsSet);
  } else {
    // Start with everything allowed
    allowedMethods = [...sdkMethods];
  }

  if (options.codeBlockedMethods) {
    // Filter down based on blocked regexps
    const blockedRegexps = options.codeBlockedMethods.map((pattern) => {
      try {
        return new RegExp(pattern);
      } catch (e) {
        throw new Error(
          `Invalid regex pattern for blocked method: "${pattern}": ${e instanceof Error ? e.message : e}`,
        );
      }
    });

    allowedMethods = allowedMethods.filter(
      (method) => !blockedRegexps.some((regexp) => regexp.test(method.fullyQualifiedName)),
    );
  }

  return allowedMethods;
}

export function blockedMethodsForCodeTool(options: McpOptions | undefined): SdkMethod[] | undefined {
  const allowedMethods = allowedMethodsForCodeTool(options);
  if (!allowedMethods) {
    return undefined;
  }

  const allowedSet = new Set(allowedMethods.map((method) => method.fullyQualifiedName));

  // Return any methods that are not explicitly allowed
  return sdkMethods.filter((method) => !allowedSet.has(method.fullyQualifiedName));
}
