import apiClient from './client';
import type {
  AdminLoginRequest,
  LoginResponse,
  TableLoginRequest,
  TableLoginResponse,
} from '../types/auth';

export async function adminLogin(data: AdminLoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/admin/login', data);
  return response.data;
}

export async function tableLogin(data: TableLoginRequest): Promise<TableLoginResponse> {
  const response = await apiClient.post<TableLoginResponse>('/auth/table/login', data);
  return response.data;
}

export async function refreshToken(): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/refresh');
  return response.data;
}
