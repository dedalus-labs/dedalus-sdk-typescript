// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import MiniSearch from 'minisearch';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { getLogger } from './logger';

type MethodEntry = {
  name: string;
  endpoint: string;
  httpMethod: string;
  summary: string;
  description: string;
  stainlessPath: string;
  qualified: string;
  params?: string[];
  response?: string;
  markdown?: string;
};

type ProseChunk = {
  content: string;
  tag: string;
  sectionContext?: string;
  source?: string;
};

type MiniSearchDocument = {
  id: string;
  kind: 'http_method' | 'prose';
  name?: string;
  endpoint?: string;
  summary?: string;
  description?: string;
  qualified?: string;
  stainlessPath?: string;
  content?: string;
  sectionContext?: string;
  _original: Record<string, unknown>;
};

type SearchResult = {
  results: (string | Record<string, unknown>)[];
};

const EMBEDDED_METHODS: MethodEntry[] = [
  {
    name: 'retrieve',
    endpoint: '/v1/models/{model_id}',
    httpMethod: 'get',
    summary: 'Retrieve Model',
    description:
      'Retrieve a model.\n\nRetrieve detailed information about a specific model, including its capabilities,\nprovider, and supported features.\n\nArgs:\n    model_id: The ID of the model to retrieve (e.g., \'openai/gpt-4\', \'anthropic/claude-3-5-sonnet-20241022\')\n    user: Authenticated user obtained from API key validation\n\nReturns:\n    Model: Information about the requested model\n\nRaises:\n    HTTPException:\n        - 401 if authentication fails\n        - 404 if model not found or not accessible with current API key\n        - 500 if internal error occurs\n\nRequires:\n    Valid API key with \'read\' scope permission\n\nExample:\n    ```python\n    import dedalus_labs\n\n    client = dedalus_labs.Client(api_key="your-api-key")\n    model = client.models.retrieve("openai/gpt-4")\n\n    print(f"Model: {model.id}")\n    print(f"Owner: {model.owned_by}")\n    ```\n\n    Response:\n    ```json\n    {\n        "id": "openai/gpt-4",\n        "object": "model",\n        "created": 1687882411,\n        "owned_by": "openai"\n    }\n    ```',
    stainlessPath: '(resource) models > (method) retrieve',
    qualified: 'client.models.retrieve',
    params: ['model_id: string;'],
    response:
      '{ id: string; created_at: string; provider: string; capabilities?: { audio?: boolean; image_generation?: boolean; input_token_limit?: number; output_token_limit?: number; streaming?: boolean; structured_output?: boolean; text?: boolean; thinking?: boolean; tools?: boolean; vision?: boolean; }; defaults?: { max_output_tokens?: number; temperature?: number; top_k?: number; top_p?: number; }; description?: string; display_name?: string; provider_declared_generation_methods?: string[]; provider_info?: object; version?: string; }',
    markdown:
      '## retrieve\n\n`client.models.retrieve(model_id: string): { id: string; created_at: string; provider: string; capabilities?: object; defaults?: object; description?: string; display_name?: string; provider_declared_generation_methods?: string[]; provider_info?: object; version?: string; }`\n\n**get** `/v1/models/{model_id}`\n\nRetrieve a model.\n\nRetrieve detailed information about a specific model, including its capabilities,\nprovider, and supported features.\n\nArgs:\n    model_id: The ID of the model to retrieve (e.g., \'openai/gpt-4\', \'anthropic/claude-3-5-sonnet-20241022\')\n    user: Authenticated user obtained from API key validation\n\nReturns:\n    Model: Information about the requested model\n\nRaises:\n    HTTPException:\n        - 401 if authentication fails\n        - 404 if model not found or not accessible with current API key\n        - 500 if internal error occurs\n\nRequires:\n    Valid API key with \'read\' scope permission\n\nExample:\n    ```python\n    import dedalus_labs\n\n    client = dedalus_labs.Client(api_key="your-api-key")\n    model = client.models.retrieve("openai/gpt-4")\n\n    print(f"Model: {model.id}")\n    print(f"Owner: {model.owned_by}")\n    ```\n\n    Response:\n    ```json\n    {\n        "id": "openai/gpt-4",\n        "object": "model",\n        "created": 1687882411,\n        "owned_by": "openai"\n    }\n    ```\n\n### Parameters\n\n- `model_id: string`\n\n### Returns\n\n- `{ id: string; created_at: string; provider: string; capabilities?: { audio?: boolean; image_generation?: boolean; input_token_limit?: number; output_token_limit?: number; streaming?: boolean; structured_output?: boolean; text?: boolean; thinking?: boolean; tools?: boolean; vision?: boolean; }; defaults?: { max_output_tokens?: number; temperature?: number; top_k?: number; top_p?: number; }; description?: string; display_name?: string; provider_declared_generation_methods?: string[]; provider_info?: object; version?: string; }`\n  Unified model metadata across all providers.\n\nCombines provider-specific schemas into a single, consistent format.\nFields that aren\'t available from a provider are set to None.\n\n  - `id: string`\n  - `created_at: string`\n  - `provider: string`\n  - `capabilities?: { audio?: boolean; image_generation?: boolean; input_token_limit?: number; output_token_limit?: number; streaming?: boolean; structured_output?: boolean; text?: boolean; thinking?: boolean; tools?: boolean; vision?: boolean; }`\n  - `defaults?: { max_output_tokens?: number; temperature?: number; top_k?: number; top_p?: number; }`\n  - `description?: string`\n  - `display_name?: string`\n  - `provider_declared_generation_methods?: string[]`\n  - `provider_info?: object`\n  - `version?: string`\n\n### Example\n\n```typescript\nimport Dedalus from \'dedalus-labs\';\n\nconst client = new Dedalus();\n\nconst model = await client.models.retrieve(\'model_id\');\n\nconsole.log(model);\n```',
  },
  {
    name: 'list',
    endpoint: '/v1/models',
    httpMethod: 'get',
    summary: 'List Models',
    description:
      'List available models.\n\nRetrieve the complete list of models available to your organization, including\nmodels from OpenAI, Anthropic, Google, xAI, Mistral, Fireworks, and DeepSeek.\n\nReturns:\n    ListModelsResponse: List of available models across all supported providers',
    stainlessPath: '(resource) models > (method) list',
    qualified: 'client.models.list',
    response:
      "{ data: { id: string; created_at: string; provider: string; capabilities?: object; defaults?: object; description?: string; display_name?: string; provider_declared_generation_methods?: string[]; provider_info?: object; version?: string; }[]; object?: 'list'; }",
    markdown:
      "## list\n\n`client.models.list(): { data: model[]; object?: 'list'; }`\n\n**get** `/v1/models`\n\nList available models.\n\nRetrieve the complete list of models available to your organization, including\nmodels from OpenAI, Anthropic, Google, xAI, Mistral, Fireworks, and DeepSeek.\n\nReturns:\n    ListModelsResponse: List of available models across all supported providers\n\n### Returns\n\n- `{ data: { id: string; created_at: string; provider: string; capabilities?: object; defaults?: object; description?: string; display_name?: string; provider_declared_generation_methods?: string[]; provider_info?: object; version?: string; }[]; object?: 'list'; }`\n  Response for /v1/models endpoint.\n\n  - `data: { id: string; created_at: string; provider: string; capabilities?: { audio?: boolean; image_generation?: boolean; input_token_limit?: number; output_token_limit?: number; streaming?: boolean; structured_output?: boolean; text?: boolean; thinking?: boolean; tools?: boolean; vision?: boolean; }; defaults?: { max_output_tokens?: number; temperature?: number; top_k?: number; top_p?: number; }; description?: string; display_name?: string; provider_declared_generation_methods?: string[]; provider_info?: object; version?: string; }[]`\n  - `object?: 'list'`\n\n### Example\n\n```typescript\nimport Dedalus from 'dedalus-labs';\n\nconst client = new Dedalus();\n\nconst listModelsResponse = await client.models.list();\n\nconsole.log(listModelsResponse);\n```",
  },
  {
    name: 'create',
    endpoint: '/v1/embeddings',
    httpMethod: 'post',
    summary: 'Create Embeddings',
    description: 'Create embeddings using the configured provider.',
    stainlessPath: '(resource) embeddings > (method) create',
    qualified: 'client.embeddings.create',
    params: [
      'input: string | string[] | number[] | number[][];',
      "model: string | 'text-embedding-ada-002' | 'text-embedding-3-small' | 'text-embedding-3-large';",
      'dimensions?: number;',
      "encoding_format?: 'float' | 'base64';",
      'user?: string;',
    ],
    response:
      "{ data: { embedding: number[]; index: number; object: 'embedding'; }[]; model: string; object: 'list'; usage: { prompt_tokens: number; total_tokens: number; }; }",
    markdown:
      "## create\n\n`client.embeddings.create(input: string | string[] | number[] | number[][], model: string | 'text-embedding-ada-002' | 'text-embedding-3-small' | 'text-embedding-3-large', dimensions?: number, encoding_format?: 'float' | 'base64', user?: string): { data: object[]; model: string; object: 'list'; usage: object; }`\n\n**post** `/v1/embeddings`\n\nCreate embeddings using the configured provider.\n\n### Parameters\n\n- `input: string | string[] | number[] | number[][]`\n  Input text to embed, encoded as a string or array of tokens. To embed multiple inputs in a single request, pass an array of strings or array of token arrays. The input must not exceed the max input tokens for the model (8192 tokens for all embedding models), cannot be an empty string, and any array must be 2048 dimensions or less. [Example Python code](https://cookbook.openai.com/examples/how_to_count_tokens_with_tiktoken) for counting tokens. In addition to the per-input token limit, all embedding  models enforce a maximum of 300,000 tokens summed across all inputs in a  single request.\n\n- `model: string | 'text-embedding-ada-002' | 'text-embedding-3-small' | 'text-embedding-3-large'`\n  ID of the model to use. You can use the [List models](/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](/docs/models) for descriptions of them.\n\n- `dimensions?: number`\n  The number of dimensions the resulting output embeddings should have. Only supported in `text-embedding-3` and later models.\n\n- `encoding_format?: 'float' | 'base64'`\n  The format to return the embeddings in. Can be either `float` or [`base64`](https://pypi.org/project/pybase64/).\n\n- `user?: string`\n  A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](/docs/guides/safety-best-practices#end-user-ids).\n\n### Returns\n\n- `{ data: { embedding: number[]; index: number; object: 'embedding'; }[]; model: string; object: 'list'; usage: { prompt_tokens: number; total_tokens: number; }; }`\n  Schema for EmbeddingResponse.\n\nFields:\n- data (required): list[Embedding]\n- model (required): str\n- object (required): Literal[\"list\"]\n- usage (required): Usage\n\n  - `data: { embedding: number[]; index: number; object: 'embedding'; }[]`\n  - `model: string`\n  - `object: 'list'`\n  - `usage: { prompt_tokens: number; total_tokens: number; }`\n\n### Example\n\n```typescript\nimport Dedalus from 'dedalus-labs';\n\nconst client = new Dedalus();\n\nconst createEmbeddingResponse = await client.embeddings.create({ input: 'string', model: 'string' });\n\nconsole.log(createEmbeddingResponse);\n```",
  },
  {
    name: 'create',
    endpoint: '/v1/audio/speech',
    httpMethod: 'post',
    summary: 'Create Speech',
    description:
      'Generate speech audio from text.\n\nGenerates audio from the input text using text-to-speech models. Supports multiple\nvoices and output formats including mp3, opus, aac, flac, wav, and pcm.\n\nReturns streaming audio data that can be saved to a file or streamed directly to users.',
    stainlessPath: '(resource) audio.speech > (method) create',
    qualified: 'client.audio.speech.create',
    params: [
      'input: string;',
      "model: string | 'tts-1' | 'tts-1-hd' | 'gpt-4o-mini-tts' | 'gpt-4o-mini-tts-2025-12-15';",
      "voice: string | 'alloy' | 'ash' | 'ballad' | 'coral' | 'echo' | 'sage' | 'shimmer' | 'verse' | 'marin' | 'cedar' | { id: string; };",
      'instructions?: string;',
      "response_format?: 'mp3' | 'opus' | 'aac' | 'flac' | 'wav' | 'pcm';",
      'speed?: number;',
      "stream_format?: 'sse' | 'audio';",
    ],
    response: 'string',
    markdown:
      "## create\n\n`client.audio.speech.create(input: string, model: string | 'tts-1' | 'tts-1-hd' | 'gpt-4o-mini-tts' | 'gpt-4o-mini-tts-2025-12-15', voice: string | 'alloy' | 'ash' | 'ballad' | 'coral' | 'echo' | 'sage' | 'shimmer' | 'verse' | 'marin' | 'cedar' | { id: string; }, instructions?: string, response_format?: 'mp3' | 'opus' | 'aac' | 'flac' | 'wav' | 'pcm', speed?: number, stream_format?: 'sse' | 'audio'): string`\n\n**post** `/v1/audio/speech`\n\nGenerate speech audio from text.\n\nGenerates audio from the input text using text-to-speech models. Supports multiple\nvoices and output formats including mp3, opus, aac, flac, wav, and pcm.\n\nReturns streaming audio data that can be saved to a file or streamed directly to users.\n\n### Parameters\n\n- `input: string`\n  The text to generate audio for. The maximum length is 4096 characters.\n\n- `model: string | 'tts-1' | 'tts-1-hd' | 'gpt-4o-mini-tts' | 'gpt-4o-mini-tts-2025-12-15'`\n  One of the available [TTS models](/docs/models#tts): `tts-1`, `tts-1-hd`, `gpt-4o-mini-tts`, or `gpt-4o-mini-tts-2025-12-15`.\n\n- `voice: string | 'alloy' | 'ash' | 'ballad' | 'coral' | 'echo' | 'sage' | 'shimmer' | 'verse' | 'marin' | 'cedar' | { id: string; }`\n  The voice to use when generating the audio. Supported built-in voices are `alloy`, `ash`, `ballad`, `coral`, `echo`, `fable`, `onyx`, `nova`, `sage`, `shimmer`, `verse`, `marin`, and `cedar`. You may also provide a custom voice object with an `id`, for example `{ \"id\": \"voice_1234\" }`. Previews of the voices are available in the [Text to speech guide](/docs/guides/text-to-speech#voice-options).\n\n- `instructions?: string`\n  Control the voice of your generated audio with additional instructions. Does not work with `tts-1` or `tts-1-hd`.\n\n- `response_format?: 'mp3' | 'opus' | 'aac' | 'flac' | 'wav' | 'pcm'`\n  The format to audio in. Supported formats are `mp3`, `opus`, `aac`, `flac`, `wav`, and `pcm`.\n\n- `speed?: number`\n  The speed of the generated audio. Select a value from `0.25` to `4.0`. `1.0` is the default.\n\n- `stream_format?: 'sse' | 'audio'`\n  The format to stream the audio in. Supported formats are `sse` and `audio`. `sse` is not supported for `tts-1` or `tts-1-hd`.\n\n### Returns\n\n- `string`\n\n### Example\n\n```typescript\nimport Dedalus from 'dedalus-labs';\n\nconst client = new Dedalus();\n\nconst speech = await client.audio.speech.create({\n  input: 'input',\n  model: 'string',\n  voice: 'string',\n});\n\nconsole.log(speech);\n\nconst content = await speech.blob()\nconsole.log(content)\n```",
  },
  {
    name: 'create',
    endpoint: '/v1/audio/transcriptions',
    httpMethod: 'post',
    summary: 'Create Transcription',
    description:
      'Transcribe audio into text.\n\nTranscribes audio files using OpenAI\'s Whisper model. Supports multiple audio formats\nincluding mp3, mp4, mpeg, mpga, m4a, wav, and webm. Maximum file size is 25 MB.\n\nArgs:\n    file: Audio file to transcribe (required)\n    model: Model ID to use (e.g., "openai/whisper-1")\n    language: ISO-639-1 language code (e.g., "en", "es") - improves accuracy\n    prompt: Optional text to guide the model\'s style\n    response_format: Format of the output (json, text, srt, verbose_json, vtt)\n    temperature: Sampling temperature between 0 and 1\n\nReturns:\n    Transcription object with the transcribed text',
    stainlessPath: '(resource) audio.transcriptions > (method) create',
    qualified: 'client.audio.transcriptions.create',
    params: [
      'file: string;',
      'model: string;',
      'language?: string;',
      'prompt?: string;',
      'response_format?: string;',
      'temperature?: number;',
    ],
    response:
      "{ duration: number; language: string; text: string; segments?: { id: number; avg_logprob: number; compression_ratio: number; end: number; no_speech_prob: number; seek: number; start: number; temperature: number; text: string; tokens: number[]; }[]; usage?: { seconds: number; type: 'duration'; }; words?: { end: number; start: number; word: string; }[]; } | { text: string; logprobs?: { token?: string; bytes?: number[]; logprob?: number; }[]; usage?: { input_tokens: number; output_tokens: number; total_tokens: number; type: 'tokens'; input_token_details?: object; } | { seconds: number; type: 'duration'; }; }",
    markdown:
      "## create\n\n`client.audio.transcriptions.create(file: string, model: string, language?: string, prompt?: string, response_format?: string, temperature?: number): { duration: number; language: string; text: string; segments?: object[]; usage?: object; words?: object[]; } | { text: string; logprobs?: object[]; usage?: object | object; }`\n\n**post** `/v1/audio/transcriptions`\n\nTranscribe audio into text.\n\nTranscribes audio files using OpenAI's Whisper model. Supports multiple audio formats\nincluding mp3, mp4, mpeg, mpga, m4a, wav, and webm. Maximum file size is 25 MB.\n\nArgs:\n    file: Audio file to transcribe (required)\n    model: Model ID to use (e.g., \"openai/whisper-1\")\n    language: ISO-639-1 language code (e.g., \"en\", \"es\") - improves accuracy\n    prompt: Optional text to guide the model's style\n    response_format: Format of the output (json, text, srt, verbose_json, vtt)\n    temperature: Sampling temperature between 0 and 1\n\nReturns:\n    Transcription object with the transcribed text\n\n### Parameters\n\n- `file: string`\n\n- `model: string`\n\n- `language?: string`\n\n- `prompt?: string`\n\n- `response_format?: string`\n\n- `temperature?: number`\n\n### Returns\n\n- `{ duration: number; language: string; text: string; segments?: { id: number; avg_logprob: number; compression_ratio: number; end: number; no_speech_prob: number; seek: number; start: number; temperature: number; text: string; tokens: number[]; }[]; usage?: { seconds: number; type: 'duration'; }; words?: { end: number; start: number; word: string; }[]; } | { text: string; logprobs?: { token?: string; bytes?: number[]; logprob?: number; }[]; usage?: { input_tokens: number; output_tokens: number; total_tokens: number; type: 'tokens'; input_token_details?: object; } | { seconds: number; type: 'duration'; }; }`\n  Represents a verbose json transcription response returned by model, based on the provided input.\n\nFields:\n  - language (required): str\n  - duration (required): float\n  - text (required): str\n  - words (optional): list[TranscriptionWord]\n  - segments (optional): list[TranscriptionSegment]\n  - usage (optional): TranscriptTextUsageDuration\n\n### Example\n\n```typescript\nimport Dedalus from 'dedalus-labs';\n\nconst client = new Dedalus();\n\nconst transcription = await client.audio.transcriptions.create({ file: fs.createReadStream('path/to/file'), model: 'model' });\n\nconsole.log(transcription);\n```",
  },
  {
    name: 'create',
    endpoint: '/v1/audio/translations',
    httpMethod: 'post',
    summary: 'Create Translation',
    description:
      'Translate audio into English.\n\nTranslates audio files in any supported language to English text using OpenAI\'s\nWhisper model. Supports the same audio formats as transcription. Maximum file size\nis 25 MB.\n\nArgs:\n    file: Audio file to translate (required)\n    model: Model ID to use (e.g., "openai/whisper-1")\n    prompt: Optional text to guide the model\'s style\n    response_format: Format of the output (json, text, srt, verbose_json, vtt)\n    temperature: Sampling temperature between 0 and 1\n\nReturns:\n    Translation object with the English translation',
    stainlessPath: '(resource) audio.translations > (method) create',
    qualified: 'client.audio.translations.create',
    params: [
      'file: string;',
      'model: string;',
      'prompt?: string;',
      'response_format?: string;',
      'temperature?: number;',
    ],
    response:
      '{ duration: number; language: string; text: string; segments?: { id: number; avg_logprob: number; compression_ratio: number; end: number; no_speech_prob: number; seek: number; start: number; temperature: number; text: string; tokens: number[]; }[]; } | { text: string; }',
    markdown:
      "## create\n\n`client.audio.translations.create(file: string, model: string, prompt?: string, response_format?: string, temperature?: number): { duration: number; language: string; text: string; segments?: object[]; } | { text: string; }`\n\n**post** `/v1/audio/translations`\n\nTranslate audio into English.\n\nTranslates audio files in any supported language to English text using OpenAI's\nWhisper model. Supports the same audio formats as transcription. Maximum file size\nis 25 MB.\n\nArgs:\n    file: Audio file to translate (required)\n    model: Model ID to use (e.g., \"openai/whisper-1\")\n    prompt: Optional text to guide the model's style\n    response_format: Format of the output (json, text, srt, verbose_json, vtt)\n    temperature: Sampling temperature between 0 and 1\n\nReturns:\n    Translation object with the English translation\n\n### Parameters\n\n- `file: string`\n\n- `model: string`\n\n- `prompt?: string`\n\n- `response_format?: string`\n\n- `temperature?: number`\n\n### Returns\n\n- `{ duration: number; language: string; text: string; segments?: { id: number; avg_logprob: number; compression_ratio: number; end: number; no_speech_prob: number; seek: number; start: number; temperature: number; text: string; tokens: number[]; }[]; } | { text: string; }`\n  Fields:  # noqa: D415.\n\n- language (required): str\n- duration (required): float\n- text (required): str\n- segments (optional): list[TranscriptionSegment]\n\n### Example\n\n```typescript\nimport Dedalus from 'dedalus-labs';\n\nconst client = new Dedalus();\n\nconst translation = await client.audio.translations.create({ file: fs.createReadStream('path/to/file'), model: 'model' });\n\nconsole.log(translation);\n```",
  },
  {
    name: 'create_variation',
    endpoint: '/v1/images/variations',
    httpMethod: 'post',
    summary: 'Create Variation',
    description: 'Create variations of an image.\n\nDALL·E 2 only. Upload an image to generate variations.',
    stainlessPath: '(resource) images > (method) create_variation',
    qualified: 'client.images.createVariation',
    params: [
      'image: string;',
      'model?: string;',
      'n?: number;',
      'response_format?: string;',
      'size?: string;',
      'user?: string;',
    ],
    response: '{ created: number; data: { b64_json?: string; revised_prompt?: string; url?: string; }[]; }',
    markdown:
      "## create_variation\n\n`client.images.createVariation(image: string, model?: string, n?: number, response_format?: string, size?: string, user?: string): { created: number; data: image[]; }`\n\n**post** `/v1/images/variations`\n\nCreate variations of an image.\n\nDALL·E 2 only. Upload an image to generate variations.\n\n### Parameters\n\n- `image: string`\n\n- `model?: string`\n\n- `n?: number`\n\n- `response_format?: string`\n\n- `size?: string`\n\n- `user?: string`\n\n### Returns\n\n- `{ created: number; data: { b64_json?: string; revised_prompt?: string; url?: string; }[]; }`\n  Response from image generation.\n\n  - `created: number`\n  - `data: { b64_json?: string; revised_prompt?: string; url?: string; }[]`\n\n### Example\n\n```typescript\nimport Dedalus from 'dedalus-labs';\n\nconst client = new Dedalus();\n\nconst imagesResponse = await client.images.createVariation({ image: fs.createReadStream('path/to/file') });\n\nconsole.log(imagesResponse);\n```",
  },
  {
    name: 'edit',
    endpoint: '/v1/images/edits',
    httpMethod: 'post',
    summary: 'Edit Image',
    description:
      'Edit images using inpainting.\n\nSupports dall-e-2 and gpt-image-1. Upload an image and optionally a mask\nto indicate which areas to regenerate based on the prompt.',
    stainlessPath: '(resource) images > (method) edit',
    qualified: 'client.images.edit',
    params: [
      'image: string;',
      'prompt: string;',
      'mask?: string;',
      'model?: string;',
      'n?: number;',
      'response_format?: string;',
      'size?: string;',
      'user?: string;',
    ],
    response: '{ created: number; data: { b64_json?: string; revised_prompt?: string; url?: string; }[]; }',
    markdown:
      "## edit\n\n`client.images.edit(image: string, prompt: string, mask?: string, model?: string, n?: number, response_format?: string, size?: string, user?: string): { created: number; data: image[]; }`\n\n**post** `/v1/images/edits`\n\nEdit images using inpainting.\n\nSupports dall-e-2 and gpt-image-1. Upload an image and optionally a mask\nto indicate which areas to regenerate based on the prompt.\n\n### Parameters\n\n- `image: string`\n\n- `prompt: string`\n\n- `mask?: string`\n\n- `model?: string`\n\n- `n?: number`\n\n- `response_format?: string`\n\n- `size?: string`\n\n- `user?: string`\n\n### Returns\n\n- `{ created: number; data: { b64_json?: string; revised_prompt?: string; url?: string; }[]; }`\n  Response from image generation.\n\n  - `created: number`\n  - `data: { b64_json?: string; revised_prompt?: string; url?: string; }[]`\n\n### Example\n\n```typescript\nimport Dedalus from 'dedalus-labs';\n\nconst client = new Dedalus();\n\nconst imagesResponse = await client.images.edit({ image: fs.createReadStream('path/to/file'), prompt: 'prompt' });\n\nconsole.log(imagesResponse);\n```",
  },
  {
    name: 'generate',
    endpoint: '/v1/images/generations',
    httpMethod: 'post',
    summary: 'Create Image',
    description:
      'Generate images from text prompts.\n\nPure image generation models only (DALL-E, GPT Image).\nFor multimodal models like gemini-2.5-flash-image, use /v1/chat/completions.',
    stainlessPath: '(resource) images > (method) generate',
    qualified: 'client.images.generate',
    params: [
      'prompt: string;',
      "background?: 'transparent' | 'opaque' | 'auto';",
      'model?: string;',
      "moderation?: 'low' | 'auto';",
      'n?: number;',
      'output_compression?: number;',
      "output_format?: 'png' | 'jpeg' | 'webp';",
      'partial_images?: number;',
      "quality?: 'auto' | 'high' | 'medium' | 'low' | 'hd' | 'standard';",
      "response_format?: 'url' | 'b64_json';",
      "size?: '256x256' | '512x512' | '1024x1024' | '1536x1024' | '1024x1536' | '1792x1024' | '1024x1792' | 'auto';",
      'stream?: boolean;',
      "style?: 'vivid' | 'natural';",
      'user?: string;',
    ],
    response: '{ created: number; data: { b64_json?: string; revised_prompt?: string; url?: string; }[]; }',
    markdown:
      "## generate\n\n`client.images.generate(prompt: string, background?: 'transparent' | 'opaque' | 'auto', model?: string, moderation?: 'low' | 'auto', n?: number, output_compression?: number, output_format?: 'png' | 'jpeg' | 'webp', partial_images?: number, quality?: 'auto' | 'high' | 'medium' | 'low' | 'hd' | 'standard', response_format?: 'url' | 'b64_json', size?: '256x256' | '512x512' | '1024x1024' | '1536x1024' | '1024x1536' | '1792x1024' | '1024x1792' | 'auto', stream?: boolean, style?: 'vivid' | 'natural', user?: string): { created: number; data: image[]; }`\n\n**post** `/v1/images/generations`\n\nGenerate images from text prompts.\n\nPure image generation models only (DALL-E, GPT Image).\nFor multimodal models like gemini-2.5-flash-image, use /v1/chat/completions.\n\n### Parameters\n\n- `prompt: string`\n  A text description of the desired image(s). The maximum length is 32000 characters for `gpt-image-1`, 1000 characters for `dall-e-2` and 4000 characters for `dall-e-3`.\n\n- `background?: 'transparent' | 'opaque' | 'auto'`\n  Allows to set transparency for the background of the generated image(s).\nThis parameter is only supported for `gpt-image-1`. Must be one of\n`transparent`, `opaque` or `auto` (default value). When `auto` is used, the\nmodel will automatically determine the best background for the image.\n\nIf `transparent`, the output format needs to support transparency, so it\nshould be set to either `png` (default value) or `webp`.\n\n- `model?: string`\n  The model to use for image generation. One of `openai/dall-e-2`, `openai/dall-e-3`, or `openai/gpt-image-1`. Defaults to `openai/dall-e-2` unless a parameter specific to `gpt-image-1` is used.\n\n- `moderation?: 'low' | 'auto'`\n  Control the content-moderation level for images generated by `gpt-image-1`. Must be either `low` for less restrictive filtering or `auto` (default value).\n\n- `n?: number`\n  The number of images to generate. Must be between 1 and 10. For `dall-e-3`, only `n=1` is supported.\n\n- `output_compression?: number`\n  The compression level (0-100%) for the generated images. This parameter is only supported for `gpt-image-1` with the `webp` or `jpeg` output formats, and defaults to 100.\n\n- `output_format?: 'png' | 'jpeg' | 'webp'`\n  The format in which the generated images are returned. This parameter is only supported for `gpt-image-1`. Must be one of `png`, `jpeg`, or `webp`.\n\n- `partial_images?: number`\n  The number of partial images to generate. This parameter is used for\nstreaming responses that return partial images. Value must be between 0 and 3.\nWhen set to 0, the response will be a single image sent in one streaming event.\n\nNote that the final image may be sent before the full number of partial images\nare generated if the full image is generated more quickly.\n\n- `quality?: 'auto' | 'high' | 'medium' | 'low' | 'hd' | 'standard'`\n  The quality of the image that will be generated.\n\n- `auto` (default value) will automatically select the best quality for the given model.\n- `high`, `medium` and `low` are supported for `gpt-image-1`.\n- `hd` and `standard` are supported for `dall-e-3`.\n- `standard` is the only option for `dall-e-2`.\n\n- `response_format?: 'url' | 'b64_json'`\n  The format in which generated images with `dall-e-2` and `dall-e-3` are returned. Must be one of `url` or `b64_json`. URLs are only valid for 60 minutes after the image has been generated. This parameter isn't supported for `gpt-image-1` which will always return base64-encoded images.\n\n- `size?: '256x256' | '512x512' | '1024x1024' | '1536x1024' | '1024x1536' | '1792x1024' | '1024x1792' | 'auto'`\n  The size of the generated images. Must be one of `1024x1024`, `1536x1024` (landscape), `1024x1536` (portrait), or `auto` (default value) for `gpt-image-1`, one of `256x256`, `512x512`, or `1024x1024` for `dall-e-2`, and one of `1024x1024`, `1792x1024`, or `1024x1792` for `dall-e-3`.\n\n- `stream?: boolean`\n  Generate the image in streaming mode. Defaults to `false`. See the\n[Image generation guide](https://platform.openai.com/docs/guides/image-generation) for more information.\nThis parameter is only supported for `gpt-image-1`.\n\n- `style?: 'vivid' | 'natural'`\n  The style of the generated images. This parameter is only supported for `dall-e-3`. Must be one of `vivid` or `natural`. Vivid causes the model to lean towards generating hyper-real and dramatic images. Natural causes the model to produce more natural, less hyper-real looking images.\n\n- `user?: string`\n  A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](https://platform.openai.com/docs/guides/safety-best-practices#end-user-ids).\n\n### Returns\n\n- `{ created: number; data: { b64_json?: string; revised_prompt?: string; url?: string; }[]; }`\n  Response from image generation.\n\n  - `created: number`\n  - `data: { b64_json?: string; revised_prompt?: string; url?: string; }[]`\n\n### Example\n\n```typescript\nimport Dedalus from 'dedalus-labs';\n\nconst client = new Dedalus();\n\nconst imagesResponse = await client.images.generate({ prompt: 'A white siamese cat' });\n\nconsole.log(imagesResponse);\n```",
  },
  {
    name: 'process',
    endpoint: '/v1/ocr',
    httpMethod: 'post',
    summary: 'Process Ocr',
    description:
      'Process a document through Mistral OCR.\n\nExtracts text from PDFs and images, returning markdown-formatted content.',
    stainlessPath: '(resource) ocr > (method) process',
    qualified: 'client.ocr.process',
    params: ['document: { document_url: string; type?: string; };', 'model?: string;'],
    response: '{ model: string; pages: { index: number; markdown: string; }[]; usage?: object; }',
    markdown:
      "## process\n\n`client.ocr.process(document: { document_url: string; type?: string; }, model?: string): { model: string; pages: ocr_page[]; usage?: object; }`\n\n**post** `/v1/ocr`\n\nProcess a document through Mistral OCR.\n\nExtracts text from PDFs and images, returning markdown-formatted content.\n\n### Parameters\n\n- `document: { document_url: string; type?: string; }`\n  Document input for OCR.\n  - `document_url: string`\n    Data URI with base64-encoded document\n  - `type?: string`\n\n- `model?: string`\n\n### Returns\n\n- `{ model: string; pages: { index: number; markdown: string; }[]; usage?: object; }`\n  OCR response schema.\n\n  - `model: string`\n  - `pages: { index: number; markdown: string; }[]`\n  - `usage?: object`\n\n### Example\n\n```typescript\nimport Dedalus from 'dedalus-labs';\n\nconst client = new Dedalus();\n\nconst ocrResponse = await client.ocr.process({ document: { document_url: 'document_url' } });\n\nconsole.log(ocrResponse);\n```",
  },
  {
    name: 'create',
    endpoint: '/v1/responses',
    httpMethod: 'post',
    summary: 'Create Response',
    description:
      "Create a response using the OpenAI Responses API.\n\nThis endpoint routes directly to OpenAI's Responses API.\nOnly OpenAI models are supported.",
    stainlessPath: '(resource) responses > (method) create',
    qualified: 'client.responses.create',
    params: [
      'background?: boolean;',
      'conversation?: string | { id: string; };',
      'credentials?: { connection_name: string; values: object; } | { connection_name: string; values: object; }[];',
      'frequency_penalty?: number;',
      'include?: string[];',
      'input?: string | object[];',
      'instructions?: string | object[];',
      'max_output_tokens?: number;',
      'max_tool_calls?: number;',
      'mcp_servers?: string | { name: string; credentials?: object; slug?: string; url?: string; version?: string; } | string | { name: string; credentials?: object; slug?: string; url?: string; version?: string; }[];',
      'metadata?: object;',
      "model?: string | { model: string; settings?: { attributes?: object; audio?: json_object_input; deferred?: boolean; extra_args?: object; extra_headers?: object; extra_query?: object; frequency_penalty?: number; generation_config?: json_object_input; include_usage?: boolean; input_audio_format?: string; input_audio_transcription?: json_object_input; logit_bias?: object; logprobs?: boolean; max_completion_tokens?: number; max_tokens?: number; metadata?: object; modalities?: string[]; n?: number; output_audio_format?: string; parallel_tool_calls?: boolean; prediction?: json_object_input; presence_penalty?: number; prompt_cache_key?: string; reasoning?: reasoning; reasoning_effort?: string; response_format?: json_object_input; safety_identifier?: string; safety_settings?: json_object_input[]; search_parameters?: json_object_input; seed?: number; service_tier?: string; stop?: string | string[]; store?: boolean; stream?: boolean; stream_options?: json_object_input; structured_output?: object; system_instruction?: json_object_input; temperature?: number; thinking?: json_object_input; timeout?: number; tool_choice?: tool_choice; tool_config?: json_object_input; top_k?: number; top_logprobs?: number; top_p?: number; truncation?: 'auto' | 'disabled'; turn_detection?: json_object_input; user?: string; verbosity?: string; voice?: string; web_search_options?: json_object_input; }; } | string | { model: string; settings?: object; }[];",
      'parallel_tool_calls?: boolean;',
      'presence_penalty?: number;',
      'previous_response_id?: string;',
      'prompt?: { id: string; variables?: object; version?: string; };',
      'prompt_cache_key?: string;',
      'reasoning?: object;',
      'safety_identifier?: string;',
      "service_tier?: 'auto' | 'default';",
      'store?: boolean;',
      'stream?: boolean;',
      'stream_options?: object;',
      'temperature?: number;',
      'text?: object;',
      'tool_choice?: string | object;',
      'tools?: object[];',
      'top_logprobs?: number;',
      'top_p?: number;',
      "truncation?: 'auto' | 'disabled';",
      'user?: string;',
    ],
    response:
      "{ id: string; created_at: number; model: string; output: object[]; status: 'completed' | 'failed' | 'in_progress' | 'cancelled' | 'queued' | 'incomplete'; background?: boolean; completed_at?: number; conversation?: object; error?: object; frequency_penalty?: number; incomplete_details?: object; instructions?: string | object[]; max_output_tokens?: number; max_tool_calls?: number; mcp_server_errors?: object; mcp_tool_results?: { arguments: json_object_input; is_error: boolean; server_name: string; tool_name: string; duration_ms?: number; result?: json_value_input; }[]; metadata?: object; object?: 'response'; output_text?: string; parallel_tool_calls?: boolean; presence_penalty?: number; previous_response_id?: string; prompt_cache_key?: string; reasoning?: object; safety_identifier?: string; service_tier?: string; store?: boolean; temperature?: number; text?: object; tool_choice?: string | object; tools?: object[]; tools_executed?: string[]; top_logprobs?: number; top_p?: number; truncation?: string; usage?: object; }",
    markdown:
      "## create\n\n`client.responses.create(background?: boolean, conversation?: string | { id: string; }, credentials?: { connection_name: string; values: object; } | object[], frequency_penalty?: number, include?: string[], input?: string | object[], instructions?: string | object[], max_output_tokens?: number, max_tool_calls?: number, mcp_servers?: string | { name: string; credentials?: object; slug?: string; url?: string; version?: string; } | string | object[], metadata?: object, model?: string | { model: string; settings?: model_settings; } | string | object[], parallel_tool_calls?: boolean, presence_penalty?: number, previous_response_id?: string, prompt?: { id: string; variables?: object; version?: string; }, prompt_cache_key?: string, reasoning?: object, safety_identifier?: string, service_tier?: 'auto' | 'default', store?: boolean, stream?: boolean, stream_options?: object, temperature?: number, text?: object, tool_choice?: string | object, tools?: object[], top_logprobs?: number, top_p?: number, truncation?: 'auto' | 'disabled', user?: string): { id: string; created_at: number; model: string; output: json_object_input[]; status: 'completed' | 'failed' | 'in_progress' | 'cancelled' | 'queued' | 'incomplete'; background?: boolean; completed_at?: number; conversation?: json_object_input; error?: json_object_input; frequency_penalty?: number; incomplete_details?: object; instructions?: string | json_object_input[]; max_output_tokens?: number; max_tool_calls?: number; mcp_server_errors?: object; mcp_tool_results?: mcp_tool_result[]; metadata?: object; object?: 'response'; output_text?: string; parallel_tool_calls?: boolean; presence_penalty?: number; previous_response_id?: string; prompt_cache_key?: string; reasoning?: json_object_input; safety_identifier?: string; service_tier?: string; store?: boolean; temperature?: number; text?: json_object_input; tool_choice?: string | json_object_input; tools?: json_object_input[]; tools_executed?: string[]; top_logprobs?: number; top_p?: number; truncation?: string; usage?: json_object_input; }`\n\n**post** `/v1/responses`\n\nCreate a response using the OpenAI Responses API.\n\nThis endpoint routes directly to OpenAI's Responses API.\nOnly OpenAI models are supported.\n\n### Parameters\n\n- `background?: boolean`\n  Whether to run the model response in the background.\n[Learn more](https://platform.openai.com/docs/guides/background).\n\n- `conversation?: string | { id: string; }`\n  Conversation that this response belongs to. Items from this conversation are prepended to the input items, and output items from this response are automatically added after completion.\n\n- `credentials?: { connection_name: string; values: object; } | { connection_name: string; values: object; }[]`\n  Credentials for MCP server authentication. Each credential is matched to servers by connection name.\n\n- `frequency_penalty?: number`\n  Penalizes new tokens based on their frequency in the text so far.\n\n- `include?: string[]`\n  Specify additional output data to include in the model response. Currently\nsupported values are:\n- `web_search_call.action.sources`: Include the sources of the web search tool call.\n- `code_interpreter_call.outputs`: Includes the outputs of python code execution\n  in code interpreter tool call items.\n- `computer_call_output.output.image_url`: Include image urls from the computer call output.\n- `file_search_call.results`: Include the search results of\n  the file search tool call.\n- `message.input_image.image_url`: Include image urls from the input message.\n- `message.output_text.logprobs`: Include logprobs with assistant messages.\n- `reasoning.encrypted_content`: Includes an encrypted version of reasoning\n  tokens in reasoning item outputs. This enables reasoning items to be used in\n  multi-turn conversations when using the Responses API statelessly (like\n  when the `store` parameter is set to `false`, or when an organization is\n  enrolled in the zero data retention program).\n\n- `input?: string | object[]`\n  Text, image, or file inputs to the model, used to generate a response.\n\nLearn more:\n- [Text inputs and outputs](https://platform.openai.com/docs/guides/text)\n- [Image inputs](https://platform.openai.com/docs/guides/images)\n- [File inputs](https://platform.openai.com/docs/guides/pdf-files)\n- [Conversation state](https://platform.openai.com/docs/guides/conversation-state)\n- [Function calling](https://platform.openai.com/docs/guides/function-calling)\n\n- `instructions?: string | object[]`\n  A system (or developer) message inserted into the model's context.\n\nWhen using along with `previous_response_id`, the instructions from a previous\nresponse will not be carried over to the next response. This makes it simple\nto swap out system (or developer) messages in new responses.\n\n- `max_output_tokens?: number`\n  An upper bound for the number of tokens that can be generated for a response, including visible output tokens and [reasoning tokens](https://platform.openai.com/docs/guides/reasoning).\n\n- `max_tool_calls?: number`\n  The maximum number of total calls to built-in tools that can be processed in a response. This maximum number applies across all built-in tool calls, not per individual tool. Any further attempts to call a tool by the model will be ignored.\n\n- `mcp_servers?: string | { name: string; credentials?: object; slug?: string; url?: string; version?: string; } | string | { name: string; credentials?: object; slug?: string; url?: string; version?: string; }[]`\n  MCP server identifiers. Accepts marketplace slugs, URLs, or MCPServerSpec objects. MCP tools are executed server-side and billed separately.\n\n- `metadata?: object`\n  Set of up to 16 key-value string pairs that can be attached to the response for structured metadata and later querying via the API or dashboard.\n\n- `model?: string | { model: string; settings?: { attributes?: object; audio?: json_object_input; deferred?: boolean; extra_args?: object; extra_headers?: object; extra_query?: object; frequency_penalty?: number; generation_config?: json_object_input; include_usage?: boolean; input_audio_format?: string; input_audio_transcription?: json_object_input; logit_bias?: object; logprobs?: boolean; max_completion_tokens?: number; max_tokens?: number; metadata?: object; modalities?: string[]; n?: number; output_audio_format?: string; parallel_tool_calls?: boolean; prediction?: json_object_input; presence_penalty?: number; prompt_cache_key?: string; reasoning?: reasoning; reasoning_effort?: string; response_format?: json_object_input; safety_identifier?: string; safety_settings?: json_object_input[]; search_parameters?: json_object_input; seed?: number; service_tier?: string; stop?: string | string[]; store?: boolean; stream?: boolean; stream_options?: json_object_input; structured_output?: object; system_instruction?: json_object_input; temperature?: number; thinking?: json_object_input; timeout?: number; tool_choice?: tool_choice; tool_config?: json_object_input; top_k?: number; top_logprobs?: number; top_p?: number; truncation?: 'auto' | 'disabled'; turn_detection?: json_object_input; user?: string; verbosity?: string; voice?: string; web_search_options?: json_object_input; }; } | string | { model: string; settings?: object; }[]`\n  Model ID used to generate the response, like `gpt-4o` or `o3`. OpenAI\noffers a wide range of models with different capabilities, performance\ncharacteristics, and price points. Refer to the [model guide](https://platform.openai.com/docs/models)\nto browse and compare available models.\n\n- `parallel_tool_calls?: boolean`\n  Whether to allow the model to run tool calls in parallel.\n\n- `presence_penalty?: number`\n  Penalizes new tokens based on whether they appear in the text so far.\n\n- `previous_response_id?: string`\n  Unique ID of the previous response to continue from when creating multi-turn conversations. Cannot be used together with `conversation`.\n\n- `prompt?: { id: string; variables?: object; version?: string; }`\n  Stored prompt template reference (BYOK).\n  - `id: string`\n    Identifier of the stored prompt.\n  - `variables?: object`\n    Variables to substitute into the stored prompt template.\n  - `version?: string`\n    Optional version identifier of the stored prompt.\n\n- `prompt_cache_key?: string`\n  Used by OpenAI to cache responses for similar requests to optimize your cache hit rates. Replaces the `user` field. [Learn more](https://platform.openai.com/docs/guides/prompt-caching).\n\n- `reasoning?: object`\n  **gpt-5 and o-series models only**\n\nConfiguration options for\n[reasoning models](https://platform.openai.com/docs/guides/reasoning).\n\n- `safety_identifier?: string`\n  A stable identifier used to help detect users of your application that may be violating OpenAI's usage policies.\nThe IDs should be a string that uniquely identifies each user. We recommend hashing their username or email address, in order to avoid sending us any identifying information. [Learn more](https://platform.openai.com/docs/guides/safety-best-practices#safety-identifiers).\n\n- `service_tier?: 'auto' | 'default'`\n  Specifies the processing type used for serving the request.\n  - If set to 'auto', then the request will be processed with the service tier configured in the Project settings. Unless otherwise configured, the Project will use 'default'.\n  - If set to 'default', then the request will be processed with the standard pricing and performance for the selected model.\n  - If set to '[flex](https://platform.openai.com/docs/guides/flex-processing)' or '[priority](https://openai.com/api-priority-processing/)', then the request will be processed with the corresponding service tier.\n  - When not set, the default behavior is 'auto'.\n\n  When the `service_tier` parameter is set, the response body will include the `service_tier` value based on the processing mode actually used to serve the request. This response value may be different from the value set in the parameter.\n\n- `store?: boolean`\n  Whether to store the generated response for later retrieval via the Responses API.\n\n- `stream?: boolean`\n  If set to true, the model response data will be streamed to the client\nas it is generated using [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format).\nSee the [Streaming section below](https://platform.openai.com/docs/api-reference/responses-streaming)\nfor more information.\n\n- `stream_options?: object`\n  Options for streaming response. Only set this when you set `stream: true`.\n\n- `temperature?: number`\n  What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.\nWe generally recommend altering this or `top_p` but not both.\n\n- `text?: object`\n  Configuration options for a text response from the model. Can be plain\ntext or structured JSON data. Learn more:\n- [Text inputs and outputs](https://platform.openai.com/docs/guides/text)\n- [Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs)\n\n- `tool_choice?: string | object`\n  How the model should select which tool (or tools) to use when generating\na response. See the `tools` parameter to see how to specify which tools\nthe model can call.\n\n- `tools?: object[]`\n  An array of tools the model may call while generating a response. You\ncan specify which tool to use by setting the `tool_choice` parameter.\n\nWe support the following categories of tools:\n- **Built-in tools**: Tools that are provided by OpenAI that extend the\n  model's capabilities, like [web search](https://platform.openai.com/docs/guides/tools-web-search)\n  or [file search](https://platform.openai.com/docs/guides/tools-file-search). Learn more about\n  [built-in tools](https://platform.openai.com/docs/guides/tools).\n- **MCP Tools**: Integrations with third-party systems via custom MCP servers\n  or predefined connectors such as Google Drive and SharePoint. Learn more about\n  [MCP Tools](https://platform.openai.com/docs/guides/tools-connectors-mcp).\n- **Function calls (custom tools)**: Functions that are defined by you,\n  enabling the model to call your own code with strongly typed arguments\n  and outputs. Learn more about\n  [function calling](https://platform.openai.com/docs/guides/function-calling). You can also use\n  custom tools to call your own code.\n\n- `top_logprobs?: number`\n  An integer between 0 and 20 specifying the number of most likely tokens to\nreturn at each token position, each with an associated log probability.\n\n- `top_p?: number`\n  An alternative to sampling with temperature, called nucleus sampling,\nwhere the model considers the results of the tokens with top_p probability\nmass. So 0.1 means only the tokens comprising the top 10% probability mass\nare considered.\n\nWe generally recommend altering this or `temperature` but not both.\n\n- `truncation?: 'auto' | 'disabled'`\n  The truncation strategy to use for the model response.\n- `auto`: If the input to this Response exceeds\n  the model's context window size, the model will truncate the\n  response to fit the context window by dropping items from the beginning of the conversation.\n- `disabled` (default): If the input size will exceed the context window\n  size for a model, the request will fail with a 400 error.\n\n- `user?: string`\n  This field is being replaced by `safety_identifier` and `prompt_cache_key`. Use `prompt_cache_key` instead to maintain caching optimizations.\nA stable identifier for your end-users.\nUsed to boost cache hit rates by better bucketing similar requests and  to help OpenAI detect and prevent abuse. [Learn more](https://platform.openai.com/docs/guides/safety-best-practices#safety-identifiers).\n\n### Returns\n\n- `{ id: string; created_at: number; model: string; output: object[]; status: 'completed' | 'failed' | 'in_progress' | 'cancelled' | 'queued' | 'incomplete'; background?: boolean; completed_at?: number; conversation?: object; error?: object; frequency_penalty?: number; incomplete_details?: object; instructions?: string | object[]; max_output_tokens?: number; max_tool_calls?: number; mcp_server_errors?: object; mcp_tool_results?: { arguments: json_object_input; is_error: boolean; server_name: string; tool_name: string; duration_ms?: number; result?: json_value_input; }[]; metadata?: object; object?: 'response'; output_text?: string; parallel_tool_calls?: boolean; presence_penalty?: number; previous_response_id?: string; prompt_cache_key?: string; reasoning?: object; safety_identifier?: string; service_tier?: string; store?: boolean; temperature?: number; text?: object; tool_choice?: string | object; tools?: object[]; tools_executed?: string[]; top_logprobs?: number; top_p?: number; truncation?: string; usage?: object; }`\n  Responses API response with Dedalus extensions.\n\n  - `id: string`\n  - `created_at: number`\n  - `model: string`\n  - `output: object[]`\n  - `status: 'completed' | 'failed' | 'in_progress' | 'cancelled' | 'queued' | 'incomplete'`\n  - `background?: boolean`\n  - `completed_at?: number`\n  - `conversation?: object`\n  - `error?: object`\n  - `frequency_penalty?: number`\n  - `incomplete_details?: object`\n  - `instructions?: string | object[]`\n  - `max_output_tokens?: number`\n  - `max_tool_calls?: number`\n  - `mcp_server_errors?: object`\n  - `mcp_tool_results?: { arguments: object; is_error: boolean; server_name: string; tool_name: string; duration_ms?: number; result?: string | number | boolean | object | string | number | boolean | object | json_value_input[][]; }[]`\n  - `metadata?: object`\n  - `object?: 'response'`\n  - `output_text?: string`\n  - `parallel_tool_calls?: boolean`\n  - `presence_penalty?: number`\n  - `previous_response_id?: string`\n  - `prompt_cache_key?: string`\n  - `reasoning?: object`\n  - `safety_identifier?: string`\n  - `service_tier?: string`\n  - `store?: boolean`\n  - `temperature?: number`\n  - `text?: object`\n  - `tool_choice?: string | object`\n  - `tools?: object[]`\n  - `tools_executed?: string[]`\n  - `top_logprobs?: number`\n  - `top_p?: number`\n  - `truncation?: string`\n  - `usage?: object`\n\n### Example\n\n```typescript\nimport Dedalus from 'dedalus-labs';\n\nconst client = new Dedalus();\n\nconst response = await client.responses.create();\n\nconsole.log(response);\n```",
  },
  {
    name: 'create',
    endpoint: '/v1/chat/completions',
    httpMethod: 'post',
    summary: 'Create Chat Completion',
    description:
      'Create a chat completion.\n\nGenerates a model response for the given conversation and configuration.\nSupports OpenAI-compatible parameters and provider-specific extensions.\n\nHeaders:\n  - Authorization: bearer key for the calling account.\n  - X-Provider / X-Provider-Key: optional headers for using your own provider API key.\n\nBehavior:\n  - If multiple models are supplied, the first one is used, and the agent may hand off to another model.\n  - Tools may be invoked on the server or signaled for the client to run.\n  - Streaming responses emit incremental deltas; non-streaming returns a single object.\n  - Usage metrics are computed when available and returned in the response.\n\nResponses:\n  - 200 OK: JSON completion object with choices, message content, and usage.\n  - 400 Bad Request: validation error.\n  - 401 Unauthorized: authentication failed.\n  - 402 Payment Required or 429 Too Many Requests: quota, balance, or rate limit issue.\n  - 500 Internal Server Error: unexpected failure.\n\nBilling:\n  - Token usage metered by the selected model(s).\n  - Tool calls and MCP sessions may be billed separately.\n  - Streaming is settled after the stream ends via an async task.\n\nExample (non-streaming HTTP):\n  POST /v1/chat/completions\n  Content-Type: application/json\n  Authorization: Bearer <key>\n\n  {\n    "model": "provider/model-name",\n    "messages": [{"role": "user", "content": "Hello"}]\n  }\n\n  200 OK\n  {\n    "id": "cmpl_123",\n    "object": "chat.completion",\n    "choices": [\n      {"index": 0, "message": {"role": "assistant", "content": "Hi there!"}, "finish_reason": "stop"}\n    ],\n    "usage": {"prompt_tokens": 3, "completion_tokens": 4, "total_tokens": 7}\n  }\n\nExample (streaming over SSE):\n  POST /v1/chat/completions\n  Accept: text/event-stream\n\n  data: {"id":"cmpl_123","choices":[{"index":0,"delta":{"content":"Hi"}}]}\n  data: {"id":"cmpl_123","choices":[{"index":0,"delta":{"content":" there!"}}]}\n  data: [DONE]',
    stainlessPath: '(resource) chat.completions > (method) create',
    qualified: 'client.chat.completions.create',
    params: [
      "model: string | { model: string; settings?: { attributes?: object; audio?: json_object_input; deferred?: boolean; extra_args?: object; extra_headers?: object; extra_query?: object; frequency_penalty?: number; generation_config?: json_object_input; include_usage?: boolean; input_audio_format?: string; input_audio_transcription?: json_object_input; logit_bias?: object; logprobs?: boolean; max_completion_tokens?: number; max_tokens?: number; metadata?: object; modalities?: string[]; n?: number; output_audio_format?: string; parallel_tool_calls?: boolean; prediction?: json_object_input; presence_penalty?: number; prompt_cache_key?: string; reasoning?: reasoning; reasoning_effort?: string; response_format?: json_object_input; safety_identifier?: string; safety_settings?: json_object_input[]; search_parameters?: json_object_input; seed?: number; service_tier?: string; stop?: string | string[]; store?: boolean; stream?: boolean; stream_options?: json_object_input; structured_output?: object; system_instruction?: json_object_input; temperature?: number; thinking?: json_object_input; timeout?: number; tool_choice?: tool_choice; tool_config?: json_object_input; top_k?: number; top_logprobs?: number; top_p?: number; truncation?: 'auto' | 'disabled'; turn_detection?: json_object_input; user?: string; verbosity?: string; voice?: string; web_search_options?: json_object_input; }; } | string | { model: string; settings?: object; }[];",
      'agent_attributes?: object;',
      "audio?: { format: 'wav' | 'aac' | 'mp3' | 'flac' | 'opus' | 'pcm16'; voice: string | 'alloy' | 'ash' | 'ballad' | 'coral' | 'echo' | 'sage' | 'shimmer' | 'verse' | 'marin' | 'cedar' | { id: string; }; };",
      'automatic_tool_execution?: boolean;',
      'cached_content?: string;',
      'correlation_id?: string;',
      'credentials?: { connection_name: string; values: object; } | { connection_name: string; values: object; }[];',
      'deferred?: boolean;',
      'deferred_calls?: { id: string; name: string; arguments?: object; blocked_by?: string[]; dependencies?: string[]; venue?: string; }[];',
      'frequency_penalty?: number;',
      'function_call?: string;',
      'functions?: { name: string; description?: string; parameters?: object; }[];',
      'generation_config?: object;',
      'guardrails?: object[];',
      'handoff_config?: object;',
      'handoff_mode?: boolean;',
      'inference_geo?: string;',
      'logit_bias?: object;',
      'logprobs?: boolean;',
      'max_completion_tokens?: number;',
      'max_tokens?: number;',
      'max_turns?: number;',
      'mcp_servers?: string | { name: string; credentials?: object; slug?: string; url?: string; version?: string; } | string | { name: string; credentials?: object; slug?: string; url?: string; version?: string; }[];',
      "messages?: { content: string | { text: string; type: 'text'; }[]; role: 'developer'; name?: string; } | { content: string | { text: string; type: 'text'; }[]; role: 'system'; name?: string; } | { content: string | { text: string; type: 'text'; } | { image_url: object; type: 'image_url'; } | { input_audio: object; type: 'input_audio'; } | { file: object; type: 'file'; }[]; role: 'user'; name?: string; } | { role: 'assistant'; audio?: { id: string; }; content?: string | { text: string; type: 'text'; } | { refusal: string; type: 'refusal'; }[]; function_call?: { arguments: string; name: string; }; name?: string; refusal?: string; tool_calls?: { id: string; function: object; type: 'function'; thought_signature?: string; } | { id: string; custom: object; type: 'custom'; }[]; } | { content: string | { text: string; type: 'text'; }[]; role: 'tool'; tool_call_id: string; } | { content: string; name: string; role: 'function'; }[];",
      'metadata?: object;',
      'modalities?: string[];',
      'model_attributes?: object;',
      'n?: number;',
      'output_config?: object;',
      'parallel_tool_calls?: boolean;',
      "prediction?: { content: string | { text: string; type: 'text'; }[]; type: 'content'; };",
      'presence_penalty?: number;',
      'prompt_cache_key?: string;',
      'prompt_cache_retention?: string;',
      "prompt_mode?: 'reasoning';",
      'reasoning_effort?: string;',
      "response_format?: { type: 'text'; } | { json_schema: { name: string; description?: string; schema?: object; strict?: boolean; }; type: 'json_schema'; } | { type: 'json_object'; };",
      'safe_prompt?: boolean;',
      'safety_identifier?: string;',
      'safety_settings?: { category: string; threshold: string; }[];',
      'search_parameters?: object;',
      'seed?: number;',
      'service_tier?: string;',
      "speed?: 'standard' | 'fast';",
      'stop?: string[] | string;',
      'store?: boolean;',
      'stream?: boolean;',
      'stream_options?: object;',
      'system_instruction?: object | string;',
      'temperature?: number;',
      "thinking?: { budget_tokens: number; type: 'enabled'; } | { type: 'disabled'; } | { type: 'adaptive'; };",
      "tool_choice?: string | { type: 'auto'; disable_parallel_tool_use?: boolean; } | { type: 'any'; disable_parallel_tool_use?: boolean; } | { name: string; type: 'tool'; disable_parallel_tool_use?: boolean; } | { type: 'none'; };",
      'tool_config?: object;',
      "tools?: { function: { name: string; }; type?: 'function'; }[];",
      'top_k?: number;',
      'top_logprobs?: number;',
      'top_p?: number;',
      'user?: string;',
      'verbosity?: string;',
      'web_search_options?: object;',
    ],
    response:
      "{ id: string; choices: { index: number; message: chat_completion_message; finish_reason?: 'stop' | 'length' | 'tool_calls' | 'content_filter' | 'function_call'; logprobs?: choice_logprobs; }[]; created: number; model: string; object: 'chat.completion'; correlation_id?: string; deferred?: { id: string; name: string; arguments?: json_object_input; blocked_by?: string[]; dependencies?: string[]; venue?: string; }[]; mcp_server_errors?: object; mcp_tool_results?: { arguments: json_object_input; is_error: boolean; server_name: string; tool_name: string; duration_ms?: number; result?: json_value_input; }[]; pending_tools?: { id: string; arguments: object; name: string; dependencies?: string[]; }[]; server_results?: object; service_tier?: 'auto' | 'default' | 'flex' | 'scale' | 'priority'; system_fingerprint?: string; tools_executed?: string[]; turns_consumed?: number; usage?: { completion_tokens: number; prompt_tokens: number; total_tokens: number; completion_tokens_details?: completion_tokens_details; prompt_tokens_details?: prompt_tokens_details; }; }",
    markdown:
      "## create\n\n`client.chat.completions.create(model: string | { model: string; settings?: model_settings; } | string | object[], agent_attributes?: object, audio?: { format: 'wav' | 'aac' | 'mp3' | 'flac' | 'opus' | 'pcm16'; voice: string | 'alloy' | 'ash' | 'ballad' | 'coral' | 'echo' | 'sage' | 'shimmer' | 'verse' | 'marin' | 'cedar' | voice_ids_or_custom_voice; }, automatic_tool_execution?: boolean, cached_content?: string, correlation_id?: string, credentials?: { connection_name: string; values: object; } | object[], deferred?: boolean, deferred_calls?: { id: string; name: string; arguments?: json_object_input; blocked_by?: string[]; dependencies?: string[]; venue?: string; }[], frequency_penalty?: number, function_call?: string, functions?: { name: string; description?: string; parameters?: object; }[], generation_config?: object, guardrails?: object[], handoff_config?: object, handoff_mode?: boolean, inference_geo?: string, logit_bias?: object, logprobs?: boolean, max_completion_tokens?: number, max_tokens?: number, max_turns?: number, mcp_servers?: string | { name: string; credentials?: object; slug?: string; url?: string; version?: string; } | string | object[], messages?: { content: string | chat_completion_content_part_text_param[]; role: 'developer'; name?: string; } | { content: string | chat_completion_content_part_text_param[]; role: 'system'; name?: string; } | { content: string | chat_completion_content_part_text_param | chat_completion_content_part_image_param | chat_completion_content_part_input_audio_param | chat_completion_content_part_file_param[]; role: 'user'; name?: string; } | { role: 'assistant'; audio?: audio; content?: string | chat_completion_content_part_text_param | chat_completion_content_part_refusal_param[]; function_call?: object; name?: string; refusal?: string; tool_calls?: chat_completion_message_tool_call | chat_completion_message_custom_tool_call[]; } | { content: string | chat_completion_content_part_text_param[]; role: 'tool'; tool_call_id: string; } | { content: string; name: string; role: 'function'; }[], metadata?: object, modalities?: string[], model_attributes?: object, n?: number, output_config?: object, parallel_tool_calls?: boolean, prediction?: { content: string | chat_completion_content_part_text_param[]; type: 'content'; }, presence_penalty?: number, prompt_cache_key?: string, prompt_cache_retention?: string, prompt_mode?: 'reasoning', reasoning_effort?: string, response_format?: { type: 'text'; } | { json_schema: object; type: 'json_schema'; } | { type: 'json_object'; }, safe_prompt?: boolean, safety_identifier?: string, safety_settings?: { category: string; threshold: string; }[], search_parameters?: object, seed?: number, service_tier?: string, speed?: 'standard' | 'fast', stop?: string[] | string, store?: boolean, stream?: boolean, stream_options?: object, system_instruction?: object | string, temperature?: number, thinking?: { budget_tokens: number; type: 'enabled'; } | { type: 'disabled'; } | { type: 'adaptive'; }, tool_choice?: string | { type: 'auto'; disable_parallel_tool_use?: boolean; } | { type: 'any'; disable_parallel_tool_use?: boolean; } | { name: string; type: 'tool'; disable_parallel_tool_use?: boolean; } | { type: 'none'; }, tool_config?: object, tools?: { function: function_definition; type?: 'function'; }[], top_k?: number, top_logprobs?: number, top_p?: number, user?: string, verbosity?: string, web_search_options?: object): { id: string; choices: choice[]; created: number; model: string; object: 'chat.completion'; correlation_id?: string; deferred?: deferred_call_response[]; mcp_server_errors?: object; mcp_tool_results?: mcp_tool_result[]; pending_tools?: object[]; server_results?: object; service_tier?: 'auto' | 'default' | 'flex' | 'scale' | 'priority'; system_fingerprint?: string; tools_executed?: string[]; turns_consumed?: number; usage?: completion_usage; }`\n\n**post** `/v1/chat/completions`\n\nCreate a chat completion.\n\nGenerates a model response for the given conversation and configuration.\nSupports OpenAI-compatible parameters and provider-specific extensions.\n\nHeaders:\n  - Authorization: bearer key for the calling account.\n  - X-Provider / X-Provider-Key: optional headers for using your own provider API key.\n\nBehavior:\n  - If multiple models are supplied, the first one is used, and the agent may hand off to another model.\n  - Tools may be invoked on the server or signaled for the client to run.\n  - Streaming responses emit incremental deltas; non-streaming returns a single object.\n  - Usage metrics are computed when available and returned in the response.\n\nResponses:\n  - 200 OK: JSON completion object with choices, message content, and usage.\n  - 400 Bad Request: validation error.\n  - 401 Unauthorized: authentication failed.\n  - 402 Payment Required or 429 Too Many Requests: quota, balance, or rate limit issue.\n  - 500 Internal Server Error: unexpected failure.\n\nBilling:\n  - Token usage metered by the selected model(s).\n  - Tool calls and MCP sessions may be billed separately.\n  - Streaming is settled after the stream ends via an async task.\n\nExample (non-streaming HTTP):\n  POST /v1/chat/completions\n  Content-Type: application/json\n  Authorization: Bearer <key>\n\n  {\n    \"model\": \"provider/model-name\",\n    \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}]\n  }\n\n  200 OK\n  {\n    \"id\": \"cmpl_123\",\n    \"object\": \"chat.completion\",\n    \"choices\": [\n      {\"index\": 0, \"message\": {\"role\": \"assistant\", \"content\": \"Hi there!\"}, \"finish_reason\": \"stop\"}\n    ],\n    \"usage\": {\"prompt_tokens\": 3, \"completion_tokens\": 4, \"total_tokens\": 7}\n  }\n\nExample (streaming over SSE):\n  POST /v1/chat/completions\n  Accept: text/event-stream\n\n  data: {\"id\":\"cmpl_123\",\"choices\":[{\"index\":0,\"delta\":{\"content\":\"Hi\"}}]}\n  data: {\"id\":\"cmpl_123\",\"choices\":[{\"index\":0,\"delta\":{\"content\":\" there!\"}}]}\n  data: [DONE]\n\n### Parameters\n\n- `model: string | { model: string; settings?: { attributes?: object; audio?: json_object_input; deferred?: boolean; extra_args?: object; extra_headers?: object; extra_query?: object; frequency_penalty?: number; generation_config?: json_object_input; include_usage?: boolean; input_audio_format?: string; input_audio_transcription?: json_object_input; logit_bias?: object; logprobs?: boolean; max_completion_tokens?: number; max_tokens?: number; metadata?: object; modalities?: string[]; n?: number; output_audio_format?: string; parallel_tool_calls?: boolean; prediction?: json_object_input; presence_penalty?: number; prompt_cache_key?: string; reasoning?: reasoning; reasoning_effort?: string; response_format?: json_object_input; safety_identifier?: string; safety_settings?: json_object_input[]; search_parameters?: json_object_input; seed?: number; service_tier?: string; stop?: string | string[]; store?: boolean; stream?: boolean; stream_options?: json_object_input; structured_output?: object; system_instruction?: json_object_input; temperature?: number; thinking?: json_object_input; timeout?: number; tool_choice?: tool_choice; tool_config?: json_object_input; top_k?: number; top_logprobs?: number; top_p?: number; truncation?: 'auto' | 'disabled'; turn_detection?: json_object_input; user?: string; verbosity?: string; voice?: string; web_search_options?: json_object_input; }; } | string | { model: string; settings?: object; }[]`\n  Model identifier. Accepts model ID strings, lists for routing, or DedalusModel objects with per-model settings.\n\n- `agent_attributes?: object`\n  Agent attributes. Values in [0.0, 1.0].\n\n- `audio?: { format: 'wav' | 'aac' | 'mp3' | 'flac' | 'opus' | 'pcm16'; voice: string | 'alloy' | 'ash' | 'ballad' | 'coral' | 'echo' | 'sage' | 'shimmer' | 'verse' | 'marin' | 'cedar' | { id: string; }; }`\n  Parameters for audio output. Required when audio output is requested with\n`modalities: [\"audio\"]`. [Learn more](/docs/guides/audio).\n\nFields:\n- voice (required): VoiceIdsOrCustomVoice\n- format (required): Literal[\"wav\", \"aac\", \"mp3\", \"flac\", \"opus\", \"pcm16\"]\n  - `format: 'wav' | 'aac' | 'mp3' | 'flac' | 'opus' | 'pcm16'`\n    Specifies the output audio format. Must be one of `wav`, `mp3`, `flac`,\n`opus`, or `pcm16`.\n  - `voice: string | 'alloy' | 'ash' | 'ballad' | 'coral' | 'echo' | 'sage' | 'shimmer' | 'verse' | 'marin' | 'cedar' | { id: string; }`\n    The voice the model uses to respond. Supported built-in voices are\n`alloy`, `ash`, `ballad`, `coral`, `echo`, `fable`, `nova`, `onyx`,\n`sage`, `shimmer`, `marin`, and `cedar`. You may also provide a\ncustom voice object with an `id`, for example `{ \"id\": \"voice_1234\" }`.\n\n- `automatic_tool_execution?: boolean`\n  Execute tools server-side. If false, returns raw tool calls for manual handling.\n\n- `cached_content?: string`\n  Optional. The name of the content [cached](https://ai.google.dev/gemini-api/docs/caching) to use as context to serve the prediction. Format: `cachedContents/{cachedContent}`\n\n- `correlation_id?: string`\n  Stable session ID for resuming a previous handoff. Returned by the server on handoff; echo it on the next request to resume.\n\n- `credentials?: { connection_name: string; values: object; } | { connection_name: string; values: object; }[]`\n  Credentials for MCP server authentication. Each credential is matched to servers by connection name.\n\n- `deferred?: boolean`\n  If set to `true`, the request returns a `request_id`. You can then get the deferred response by GET `/v1/chat/deferred-completion/{request_id}`.\n\n- `deferred_calls?: { id: string; name: string; arguments?: object; blocked_by?: string[]; dependencies?: string[]; venue?: string; }[]`\n  Tier 2 stateless resumption. Deferred tool specs from a previous handoff response, sent back verbatim so the server can resume without Redis.\n\n- `frequency_penalty?: number`\n  Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim. \n\n- `function_call?: string`\n  Deprecated in favor of `tool_choice`.  Controls which (if any) function is called by the model.  `none` means the model will not call a function and instead generates a message.  `auto` means the model can pick between generating a message or calling a function.  Specifying a particular function via `{\"name\": \"my_function\"}` forces the model to call that function.  `none` is the default when no functions are present. `auto` is the default if functions are present. \n\n- `functions?: { name: string; description?: string; parameters?: object; }[]`\n  Deprecated in favor of `tools`.  A list of functions the model may generate JSON inputs for. \n\n- `generation_config?: object`\n  Generation parameters wrapper (Google-specific)\n\n- `guardrails?: object[]`\n  Content filtering and safety policy configuration.\n\n- `handoff_config?: object`\n  Configuration for multi-model handoffs.\n\n- `handoff_mode?: boolean`\n  Handoff control. None or omitted: auto-detect. true: structured handoff (SDK). false: drop-in (LLM re-run for mixed turns).\n\n- `inference_geo?: string`\n  Specifies the geographic region for inference processing. If not specified, the workspace's `default_inference_geo` is used.\n\n- `logit_bias?: object`\n  Modify the likelihood of specified tokens appearing in the completion.  Accepts a JSON object that maps tokens (specified by their token ID in the tokenizer) to an associated bias value from -100 to 100. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token. \n\n- `logprobs?: boolean`\n  Whether to return log probabilities of the output tokens or not. If true, returns the log probabilities of each output token returned in the `content` of `message`. \n\n- `max_completion_tokens?: number`\n  Maximum tokens in completion (newer parameter name)\n\n- `max_tokens?: number`\n  Maximum tokens in completion\n\n- `max_turns?: number`\n  Maximum conversation turns.\n\n- `mcp_servers?: string | { name: string; credentials?: object; slug?: string; url?: string; version?: string; } | string | { name: string; credentials?: object; slug?: string; url?: string; version?: string; }[]`\n  MCP server identifiers. Accepts marketplace slugs, URLs, or MCPServerSpec objects. MCP tools are executed server-side and billed separately.\n\n- `messages?: { content: string | { text: string; type: 'text'; }[]; role: 'developer'; name?: string; } | { content: string | { text: string; type: 'text'; }[]; role: 'system'; name?: string; } | { content: string | { text: string; type: 'text'; } | { image_url: object; type: 'image_url'; } | { input_audio: object; type: 'input_audio'; } | { file: object; type: 'file'; }[]; role: 'user'; name?: string; } | { role: 'assistant'; audio?: { id: string; }; content?: string | { text: string; type: 'text'; } | { refusal: string; type: 'refusal'; }[]; function_call?: { arguments: string; name: string; }; name?: string; refusal?: string; tool_calls?: { id: string; function: object; type: 'function'; thought_signature?: string; } | { id: string; custom: object; type: 'custom'; }[]; } | { content: string | { text: string; type: 'text'; }[]; role: 'tool'; tool_call_id: string; } | { content: string; name: string; role: 'function'; }[]`\n  Conversation history (OpenAI: messages, Google: contents, Responses: input)\n\n- `metadata?: object`\n  Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format, and querying for objects via API or the dashboard.  Keys are strings with a maximum length of 64 characters. Values are strings with a maximum length of 512 characters. \n\n- `modalities?: string[]`\n  Output types that you would like the model to generate. Most models are capable of generating text, which is the default:  `[\"text\"]`  The `gpt-4o-audio-preview` model can also be used to [generate audio](/docs/guides/audio). To request that this model generate both text and audio responses, you can use:  `[\"text\", \"audio\"]` \n\n- `model_attributes?: object`\n  Model attributes for routing. Maps model IDs to attribute dictionaries with values in [0.0, 1.0].\n\n- `n?: number`\n  How many chat completion choices to generate for each input message. Note that you will be charged based on the number of generated tokens across all of the choices. Keep `n` as `1` to minimize costs.\n\n- `output_config?: object`\n\n- `parallel_tool_calls?: boolean`\n  Whether to enable parallel tool calls (Anthropic uses inverted polarity).\n\n- `prediction?: { content: string | { text: string; type: 'text'; }[]; type: 'content'; }`\n  Static predicted output content, such as the content of a text file that is\nbeing regenerated.\n\nFields:\n- type (required): Literal[\"content\"]\n- content (required): str | Annotated[list[ChatCompletionRequestMessageContentPartText], MinLen(1), ArrayTitle(\"PredictionContentArray\")]\n  - `content: string | { text: string; type: 'text'; }[]`\n    The content that should be matched when generating a model response.\nIf generated tokens would match this content, the entire model response\ncan be returned much more quickly.\n  - `type: 'content'`\n    The type of the predicted content you want to provide. This type is\ncurrently always `content`.\n\n- `presence_penalty?: number`\n  Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics. \n\n- `prompt_cache_key?: string`\n  Used by OpenAI to cache responses for similar requests to optimize your cache hit rates. Replaces the `user` field. [Learn more](/docs/guides/prompt-caching). \n\n- `prompt_cache_retention?: string`\n  The retention policy for the prompt cache. Set to `24h` to enable extended prompt caching, which keeps cached prefixes active for longer, up to a maximum of 24 hours. [Learn more](/docs/guides/prompt-caching#prompt-cache-retention). \n\n- `prompt_mode?: 'reasoning'`\n  Allows toggling between the reasoning mode and no system prompt. When set to `reasoning` the system prompt for reasoning models will be used.\n\n- `reasoning_effort?: string`\n  Constrains effort on reasoning for [reasoning models](https://platform.openai.com/docs/guides/reasoning). Currently supported values are `none`, `minimal`, `low`, `medium`, `high`, and `xhigh`. Reducing reasoning effort can result in faster responses and fewer tokens used on reasoning in a response.  - `gpt-5.1` defaults to `none`, which does not perform reasoning. The supported reasoning values for `gpt-5.1` are `none`, `low`, `medium`, and `high`. Tool calls are supported for all reasoning values in gpt-5.1. - All models before `gpt-5.1` default to `medium` reasoning effort, and do not support `none`. - The `gpt-5-pro` model defaults to (and only supports) `high` reasoning effort. - `xhigh` is supported for all models after `gpt-5.1-codex-max`. \n\n- `response_format?: { type: 'text'; } | { json_schema: { name: string; description?: string; schema?: object; strict?: boolean; }; type: 'json_schema'; } | { type: 'json_object'; }`\n  An object specifying the format that the model must output.  Setting to `{ \"type\": \"json_schema\", \"json_schema\": {...} }` enables Structured Outputs which ensures the model will match your supplied JSON schema. Learn more in the [Structured Outputs guide](/docs/guides/structured-outputs).  Setting to `{ \"type\": \"json_object\" }` enables the older JSON mode, which ensures the message the model generates is valid JSON. Using `json_schema` is preferred for models that support it. \n\n- `safe_prompt?: boolean`\n  Whether to inject a safety prompt before all conversations.\n\n- `safety_identifier?: string`\n  A stable identifier used to help detect users of your application that may be violating OpenAI's usage policies. The IDs should be a string that uniquely identifies each user. We recommend hashing their username or email address, in order to avoid sending us any identifying information. [Learn more](/docs/guides/safety-best-practices#safety-identifiers). \n\n- `safety_settings?: { category: string; threshold: string; }[]`\n  Safety/content filtering settings (Google-specific)\n\n- `search_parameters?: object`\n  Set the parameters to be used for searched data. If not set, no data will be acquired by the model.\n\n- `seed?: number`\n  Random seed for deterministic output\n\n- `service_tier?: string`\n  Service tier for request processing\n\n- `speed?: 'standard' | 'fast'`\n  The inference speed mode for this request. `\"fast\"` enables high output-tokens-per-second inference.\n\n- `stop?: string[] | string`\n  Sequences that stop generation\n\n- `store?: boolean`\n  Whether or not to store the output of this chat completion request for use in our [model distillation](/docs/guides/distillation) or [evals](/docs/guides/evals) products.  Supports text and image inputs. Note: image inputs over 8MB will be dropped. \n\n- `stream?: boolean`\n  Enable streaming response\n\n- `stream_options?: object`\n  Options for streaming response. Only set this when you set `stream: true`. \n\n- `system_instruction?: object | string`\n  System instruction/prompt\n\n- `temperature?: number`\n  Sampling temperature (0-2 for most providers)\n\n- `thinking?: { budget_tokens: number; type: 'enabled'; } | { type: 'disabled'; } | { type: 'adaptive'; }`\n  Extended thinking configuration (Anthropic-specific)\n\n- `tool_choice?: string | { type: 'auto'; disable_parallel_tool_use?: boolean; } | { type: 'any'; disable_parallel_tool_use?: boolean; } | { name: string; type: 'tool'; disable_parallel_tool_use?: boolean; } | { type: 'none'; }`\n  Controls which (if any) tool is called by the model. `none` means the model will not call any tool and instead generates a message. `auto` means the model can pick between generating a message or calling one or more tools. `required` means the model must call one or more tools. Specifying a particular tool via `{\"type\": \"function\", \"function\": {\"name\": \"my_function\"}}` forces the model to call that tool.  `none` is the default when no tools are present. `auto` is the default if tools are present. \n\n- `tool_config?: object`\n  Tool calling configuration (Google-specific)\n\n- `tools?: { function: { name: string; }; type?: 'function'; }[]`\n  Available tools/functions for the model\n\n- `top_k?: number`\n  Top-k sampling parameter\n\n- `top_logprobs?: number`\n  An integer between 0 and 20 specifying the number of most likely tokens to return at each token position, each with an associated log probability. `logprobs` must be set to `true` if this parameter is used. \n\n- `top_p?: number`\n  Nucleus sampling threshold\n\n- `user?: string`\n  This field is being replaced by `safety_identifier` and `prompt_cache_key`. Use `prompt_cache_key` instead to maintain caching optimizations. A stable identifier for your end-users. Used to boost cache hit rates by better bucketing similar requests and  to help OpenAI detect and prevent abuse. [Learn more](/docs/guides/safety-best-practices#safety-identifiers). \n\n- `verbosity?: string`\n  Constrains the verbosity of the model's response. Lower values will result in more concise responses, while higher values will result in more verbose responses. Currently supported values are `low`, `medium`, and `high`. \n\n- `web_search_options?: object`\n  This tool searches the web for relevant results to use in a response. Learn more about the [web search tool](/docs/guides/tools-web-search?api-mode=chat). \n\n### Returns\n\n- `{ id: string; choices: { index: number; message: chat_completion_message; finish_reason?: 'stop' | 'length' | 'tool_calls' | 'content_filter' | 'function_call'; logprobs?: choice_logprobs; }[]; created: number; model: string; object: 'chat.completion'; correlation_id?: string; deferred?: { id: string; name: string; arguments?: json_object_input; blocked_by?: string[]; dependencies?: string[]; venue?: string; }[]; mcp_server_errors?: object; mcp_tool_results?: { arguments: json_object_input; is_error: boolean; server_name: string; tool_name: string; duration_ms?: number; result?: json_value_input; }[]; pending_tools?: { id: string; arguments: object; name: string; dependencies?: string[]; }[]; server_results?: object; service_tier?: 'auto' | 'default' | 'flex' | 'scale' | 'priority'; system_fingerprint?: string; tools_executed?: string[]; turns_consumed?: number; usage?: { completion_tokens: number; prompt_tokens: number; total_tokens: number; completion_tokens_details?: completion_tokens_details; prompt_tokens_details?: prompt_tokens_details; }; }`\n  Chat completion response for Dedalus API.\n\nOpenAI-compatible chat completion response with Dedalus extensions.\nMaintains full compatibility with OpenAI API while providing additional\nfeatures like server-side tool execution tracking and MCP error reporting.\n\n  - `id: string`\n  - `choices: { index: number; message: { content: string; refusal: string; role: 'assistant'; annotations?: object[]; audio?: object; function_call?: object; tool_calls?: chat_completion_message_tool_call | chat_completion_message_custom_tool_call[]; }; finish_reason?: 'stop' | 'length' | 'tool_calls' | 'content_filter' | 'function_call'; logprobs?: { content?: chat_completion_token_logprob[]; refusal?: chat_completion_token_logprob[]; }; }[]`\n  - `created: number`\n  - `model: string`\n  - `object: 'chat.completion'`\n  - `correlation_id?: string`\n  - `deferred?: { id: string; name: string; arguments?: object; blocked_by?: string[]; dependencies?: string[]; venue?: string; }[]`\n  - `mcp_server_errors?: object`\n  - `mcp_tool_results?: { arguments: object; is_error: boolean; server_name: string; tool_name: string; duration_ms?: number; result?: string | number | boolean | object | string | number | boolean | object | json_value_input[][]; }[]`\n  - `pending_tools?: { id: string; arguments: object; name: string; dependencies?: string[]; }[]`\n  - `server_results?: object`\n  - `service_tier?: 'auto' | 'default' | 'flex' | 'scale' | 'priority'`\n  - `system_fingerprint?: string`\n  - `tools_executed?: string[]`\n  - `turns_consumed?: number`\n  - `usage?: { completion_tokens: number; prompt_tokens: number; total_tokens: number; completion_tokens_details?: { accepted_prediction_tokens?: number; audio_tokens?: number; reasoning_tokens?: number; rejected_prediction_tokens?: number; }; prompt_tokens_details?: { audio_tokens?: number; cached_tokens?: number; }; }`\n\n### Example\n\n```typescript\nimport Dedalus from 'dedalus-labs';\n\nconst client = new Dedalus();\n\nconst stream = await client.chat.completions.create({ model: 'openai/gpt-5' });\nfor await (const chatCompletionChunk of stream) {\n  console.log(chatCompletionChunk);\n}\n```",
  },
];

const INDEX_OPTIONS = {
  fields: [
    'name',
    'endpoint',
    'summary',
    'description',
    'qualified',
    'stainlessPath',
    'content',
    'sectionContext',
  ],
  storeFields: ['kind', '_original'],
  searchOptions: {
    prefix: true,
    fuzzy: 0.2,
    boost: {
      name: 3,
      endpoint: 2,
      summary: 2,
      qualified: 2,
      content: 1,
    } as Record<string, number>,
  },
};

/**
 * Self-contained local search engine backed by MiniSearch.
 * Method data is embedded at SDK build time; prose documents
 * can be loaded from an optional docs directory at runtime.
 */
export class LocalDocsSearch {
  private methodIndex: MiniSearch<MiniSearchDocument>;
  private proseIndex: MiniSearch<MiniSearchDocument>;

  private constructor() {
    this.methodIndex = new MiniSearch<MiniSearchDocument>(INDEX_OPTIONS);
    this.proseIndex = new MiniSearch<MiniSearchDocument>(INDEX_OPTIONS);
  }

  static async create(opts?: { docsDir?: string }): Promise<LocalDocsSearch> {
    const instance = new LocalDocsSearch();
    instance.indexMethods(EMBEDDED_METHODS);
    if (opts?.docsDir) {
      await instance.loadDocsDirectory(opts.docsDir);
    }
    return instance;
  }

  // Note: Language is accepted for interface consistency with remote search, but currently has no
  // effect since this local search only supports TypeScript docs.
  search(props: {
    query: string;
    language?: string;
    detail?: string;
    maxResults?: number;
    maxLength?: number;
  }): SearchResult {
    const { query, detail = 'default', maxResults = 5, maxLength = 100_000 } = props;

    const useMarkdown = detail === 'verbose' || detail === 'high';

    // Search both indices and merge results by score
    const methodHits = this.methodIndex
      .search(query)
      .map((hit) => ({ ...hit, _kind: 'http_method' as const }));
    const proseHits = this.proseIndex.search(query).map((hit) => ({ ...hit, _kind: 'prose' as const }));
    const merged = [...methodHits, ...proseHits].sort((a, b) => b.score - a.score);
    const top = merged.slice(0, maxResults);

    const fullResults: (string | Record<string, unknown>)[] = [];

    for (const hit of top) {
      const original = (hit as Record<string, unknown>)['_original'];
      if (hit._kind === 'http_method') {
        const m = original as MethodEntry;
        if (useMarkdown && m.markdown) {
          fullResults.push(m.markdown);
        } else {
          fullResults.push({
            method: m.qualified,
            summary: m.summary,
            description: m.description,
            endpoint: `${m.httpMethod.toUpperCase()} ${m.endpoint}`,
            ...(m.params ? { params: m.params } : {}),
            ...(m.response ? { response: m.response } : {}),
          });
        }
      } else {
        const c = original as ProseChunk;
        fullResults.push({
          content: c.content,
          ...(c.source ? { source: c.source } : {}),
        });
      }
    }

    let totalLength = 0;
    const results: (string | Record<string, unknown>)[] = [];
    for (const result of fullResults) {
      const len = typeof result === 'string' ? result.length : JSON.stringify(result).length;
      totalLength += len;
      if (totalLength > maxLength) break;
      results.push(result);
    }

    if (results.length < fullResults.length) {
      results.unshift(`Truncated; showing ${results.length} of ${fullResults.length} results.`);
    }

    return { results };
  }

  private indexMethods(methods: MethodEntry[]): void {
    const docs: MiniSearchDocument[] = methods.map((m, i) => ({
      id: `method-${i}`,
      kind: 'http_method' as const,
      name: m.name,
      endpoint: m.endpoint,
      summary: m.summary,
      description: m.description,
      qualified: m.qualified,
      stainlessPath: m.stainlessPath,
      _original: m as unknown as Record<string, unknown>,
    }));
    if (docs.length > 0) {
      this.methodIndex.addAll(docs);
    }
  }

  private async loadDocsDirectory(docsDir: string): Promise<void> {
    let entries;
    try {
      entries = await fs.readdir(docsDir, { withFileTypes: true });
    } catch (err) {
      getLogger().warn({ err, docsDir }, 'Could not read docs directory');
      return;
    }

    const files = entries
      .filter((e) => e.isFile())
      .filter((e) => e.name.endsWith('.md') || e.name.endsWith('.markdown') || e.name.endsWith('.json'));

    for (const file of files) {
      try {
        const filePath = path.join(docsDir, file.name);
        const content = await fs.readFile(filePath, 'utf-8');

        if (file.name.endsWith('.json')) {
          const texts = extractTexts(JSON.parse(content));
          if (texts.length > 0) {
            this.indexProse(texts.join('\n\n'), file.name);
          }
        } else {
          this.indexProse(content, file.name);
        }
      } catch (err) {
        getLogger().warn({ err, file: file.name }, 'Failed to index docs file');
      }
    }
  }

  private indexProse(markdown: string, source: string): void {
    const chunks = chunkMarkdown(markdown);
    const baseId = this.proseIndex.documentCount;

    const docs: MiniSearchDocument[] = chunks.map((chunk, i) => ({
      id: `prose-${baseId + i}`,
      kind: 'prose' as const,
      content: chunk.content,
      ...(chunk.sectionContext != null ? { sectionContext: chunk.sectionContext } : {}),
      _original: { ...chunk, source } as unknown as Record<string, unknown>,
    }));

    if (docs.length > 0) {
      this.proseIndex.addAll(docs);
    }
  }
}

/** Lightweight markdown chunker — splits on headers, chunks by word count. */
function chunkMarkdown(markdown: string): { content: string; tag: string; sectionContext?: string }[] {
  // Strip YAML frontmatter
  const stripped = markdown.replace(/^---\n[\s\S]*?\n---\n?/, '');
  const lines = stripped.split('\n');

  const chunks: { content: string; tag: string; sectionContext?: string }[] = [];
  const headers: string[] = [];
  let current: string[] = [];

  const flush = () => {
    const text = current.join('\n').trim();
    if (!text) return;
    const sectionContext = headers.length > 0 ? headers.join(' > ') : undefined;
    // Split into ~200-word chunks
    const words = text.split(/\s+/);
    for (let i = 0; i < words.length; i += 200) {
      const slice = words.slice(i, i + 200).join(' ');
      if (slice) {
        chunks.push({ content: slice, tag: 'p', ...(sectionContext != null ? { sectionContext } : {}) });
      }
    }
    current = [];
  };

  for (const line of lines) {
    const headerMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (headerMatch) {
      flush();
      const level = headerMatch[1]!.length;
      const text = headerMatch[2]!.trim();
      while (headers.length >= level) headers.pop();
      headers.push(text);
    } else {
      current.push(line);
    }
  }
  flush();

  return chunks;
}

/** Recursively extracts string values from a JSON structure. */
function extractTexts(data: unknown, depth = 0): string[] {
  if (depth > 10) return [];
  if (typeof data === 'string') return data.trim() ? [data] : [];
  if (Array.isArray(data)) return data.flatMap((item) => extractTexts(item, depth + 1));
  if (typeof data === 'object' && data !== null) {
    return Object.values(data).flatMap((v) => extractTexts(v, depth + 1));
  }
  return [];
}
