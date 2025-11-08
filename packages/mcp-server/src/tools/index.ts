// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Metadata, Endpoint, HandlerFunction } from './types';

export { Metadata, Endpoint, HandlerFunction };

import get_root from './root/get-root';
import check_health from './health/check-health';
import retrieve_models from './models/retrieve-models';
import list_models from './models/list-models';
import create_embeddings from './embeddings/create-embeddings';
import create_audio_speech from './audio/speech/create-audio-speech';
import create_audio_transcriptions from './audio/transcriptions/create-audio-transcriptions';
import create_audio_translations from './audio/translations/create-audio-translations';
import create_variation_images from './images/create-variation-images';
import edit_images from './images/edit-images';
import generate_images from './images/generate-images';
import create_chat_completions from './chat/completions/create-chat-completions';

export const endpoints: Endpoint[] = [];

function addEndpoint(endpoint: Endpoint) {
  endpoints.push(endpoint);
}

addEndpoint(get_root);
addEndpoint(check_health);
addEndpoint(retrieve_models);
addEndpoint(list_models);
addEndpoint(create_embeddings);
addEndpoint(create_audio_speech);
addEndpoint(create_audio_transcriptions);
addEndpoint(create_audio_translations);
addEndpoint(create_variation_images);
addEndpoint(edit_images);
addEndpoint(generate_images);
addEndpoint(create_chat_completions);

export type Filter = {
  type: 'resource' | 'operation' | 'tag' | 'tool';
  op: 'include' | 'exclude';
  value: string;
};

export function query(filters: Filter[], endpoints: Endpoint[]): Endpoint[] {
  const allExcludes = filters.length > 0 && filters.every((filter) => filter.op === 'exclude');
  const unmatchedFilters = new Set(filters);

  const filtered = endpoints.filter((endpoint: Endpoint) => {
    let included = false || allExcludes;

    for (const filter of filters) {
      if (match(filter, endpoint)) {
        unmatchedFilters.delete(filter);
        included = filter.op === 'include';
      }
    }

    return included;
  });

  // Check if any filters didn't match
  const unmatched = Array.from(unmatchedFilters).filter((f) => f.type === 'tool' || f.type === 'resource');
  if (unmatched.length > 0) {
    throw new Error(
      `The following filters did not match any endpoints: ${unmatched
        .map((f) => `${f.type}=${f.value}`)
        .join(', ')}`,
    );
  }

  return filtered;
}

function match({ type, value }: Filter, endpoint: Endpoint): boolean {
  switch (type) {
    case 'resource': {
      const regexStr = '^' + normalizeResource(value).replace(/\*/g, '.*') + '$';
      const regex = new RegExp(regexStr);
      return regex.test(normalizeResource(endpoint.metadata.resource));
    }
    case 'operation':
      return endpoint.metadata.operation === value;
    case 'tag':
      return endpoint.metadata.tags.includes(value);
    case 'tool':
      return endpoint.tool.name === value;
  }
}

function normalizeResource(resource: string): string {
  return resource.toLowerCase().replace(/[^a-z.*\-_]*/g, '');
}
