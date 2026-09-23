import { ApiResponse } from '../types/interfaces';

export function ok<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message
  };
}
