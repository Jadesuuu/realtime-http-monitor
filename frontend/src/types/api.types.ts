export interface Response {
  id: number;
  requestPayload: string;
  responseData: string;
  statusCode: number;
  responseTime: number;
  timestamp: string;
}

export interface ResponseTimeChartProps {
  responses: Response[];
}
