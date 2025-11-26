import apiClient from './apiClient';
import type { AxiosRequestConfig, Method } from 'axios';

interface RequestOptions<TBody = unknown> {
  url: string;
  method?: Method;
  body?: TBody;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

export async function httpRequest<TResponse = any, TBody = unknown>(
  options: RequestOptions<TBody>
): Promise<TResponse> {
  const { url, method = 'GET', body, params, headers } = options;

  const config: AxiosRequestConfig = {
    url,
    method,
    params,
    data: body,
    headers,
  };

  const response = await apiClient.request<TResponse>(config);
  return response.data;
}
