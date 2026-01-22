// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Ocr extends APIResource {
  /**
   * Process a document through Mistral OCR.
   *
   * Extracts text from PDFs and images, returning markdown-formatted content.
   */
  process(body: OcrProcessParams, options?: RequestOptions): APIPromise<OcrResponse> {
    return this._client.post('/v1/ocr', { body, ...options });
  }
}

/**
 * Document input for OCR.
 */
export interface OcrDocument {
  /**
   * Data URI with base64-encoded document
   */
  document_url: string;

  type?: string;
}

/**
 * Single page OCR result.
 */
export interface OcrPage {
  index: number;

  markdown: string;
}

/**
 * OCR request schema.
 */
export interface OcrRequest {
  /**
   * Document input for OCR.
   */
  document: OcrDocument;

  model?: string;
}

/**
 * OCR response schema.
 */
export interface OcrResponse {
  model: string;

  pages: Array<OcrPage>;

  usage?: { [key: string]: unknown } | null;
}

export interface OcrProcessParams {
  /**
   * Document input for OCR.
   */
  document: OcrDocument;

  model?: string;
}

export declare namespace Ocr {
  export {
    type OcrDocument as OcrDocument,
    type OcrPage as OcrPage,
    type OcrRequest as OcrRequest,
    type OcrResponse as OcrResponse,
    type OcrProcessParams as OcrProcessParams,
  };
}
