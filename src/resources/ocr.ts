// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class OCR extends APIResource {
  /**
   * Process a document through Mistral OCR.
   *
   * Extracts text from PDFs and images, returning markdown-formatted content.
   */
  process(body: OCRProcessParams, options?: RequestOptions): APIPromise<OCRResponse> {
    return this._client.post('/v1/ocr', { body, ...options });
  }
}

/**
 * Document input for OCR.
 */
export interface OCRDocument {
  /**
   * Data URI with base64-encoded document
   */
  document_url: string;

  type?: string;
}

/**
 * Single page OCR result.
 */
export interface OCRPage {
  index: number;

  markdown: string;
}

/**
 * OCR request schema.
 */
export interface OCRRequest {
  /**
   * Document input for OCR.
   */
  document: OCRDocument;

  model?: string;
}

/**
 * OCR response schema.
 */
export interface OCRResponse {
  model: string;

  pages: Array<OCRPage>;

  usage?: { [key: string]: unknown } | null;
}

export interface OCRProcessParams {
  /**
   * Document input for OCR.
   */
  document: OCRDocument;

  model?: string;
}

export declare namespace OCR {
  export {
    type OCRDocument as OCRDocument,
    type OCRPage as OCRPage,
    type OCRRequest as OCRRequest,
    type OCRResponse as OCRResponse,
    type OCRProcessParams as OCRProcessParams
  };
}
