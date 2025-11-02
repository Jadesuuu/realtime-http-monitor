export interface Response {
  id: number;
  requestPayload: string;
  responseData: string;
  statusCode: number;
  responseTime: number;
  timestamp: string;
}

export interface ParsedRequest {
  timestamp: string;
  random: number;
  data: {
    value1: number;
    value2: string;
  };
}

export interface ParsedResponse {
  args: Record<string, string>;
  data: string;
  files: Record<string, unknown>;
  form: Record<string, string>;
  headers: ResponseHeaders;
  json: ParsedRequest | null;
  method: string;
  origin: string;
  url: string;
}

export interface ResponseHeaders {
  Accept?: string;
  "Accept-Encoding"?: string;
  "Content-Length"?: string;
  "Content-Type"?: string;
  Host?: string;
  "User-Agent"?: string;
  "X-Amzn-Trace-Id"?: string;
  [key: string]: string | undefined;
}

export interface MonitorStats {
  totalRequests: number;
  successRate: number;
  avgResponseTime: number;
  failedRequests: number;
  lastPingTime: string;
}
