import axios from 'axios';
import { message } from 'antd';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const request = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'x-demo-role': 'Admin'
  }
});

request.interceptors.response.use(
  (response) => response,
  (error) => {
    const text = error.response?.data?.message || error.message || '请求失败';
    message.error(text);
    return Promise.reject(error);
  }
);

export async function getData<T>(url: string): Promise<T> {
  const response = await request.get<ApiResponse<T>>(url);
  return response.data.data;
}

export async function postData<T>(url: string, payload: unknown): Promise<T> {
  const response = await request.post<ApiResponse<T>>(url, payload);
  return response.data.data;
}

export async function patchData<T>(url: string, payload?: unknown): Promise<T> {
  const response = await request.patch<ApiResponse<T>>(url, payload);
  return response.data.data;
}
