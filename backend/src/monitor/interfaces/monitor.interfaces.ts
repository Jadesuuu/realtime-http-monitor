/**
 * Random payload structure sent to httpbin.org
 */
export interface RandomPayload {
  timeStamp: string;
  random: number;
  data: PayloadData;
}

export interface PayloadData {
  value1: number;
  value2: string;
}

/**
 * Response structure from httpbin.org/anything
 */
export interface HttpBinResponse {
  args: Record<string, string>;
  data: string;
  files: Record<string, unknown>;
  form: Record<string, string>;
  headers: HttpBinHeaders;
  json: RandomPayload | null;
  method: string;
  origin: string;
  url: string;
}

export interface HttpBinHeaders {
  Accept?: string;
  'Accept-Encoding'?: string;
  'Content-Length'?: string;
  'Content-Type'?: string;
  Host?: string;
  'User-Agent'?: string;
  'X-Amzn-Trace-Id'?: string;
  [key: string]: string | undefined;
}
