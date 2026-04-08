import apiClient from './client';
import type {
  TableResponse,
  TableCreateRequest,
  TableUpdateRequest,
  SessionEndResponse,
  OrderHistoryResponse,
  PagedResponse,
} from '../types/table';

export async function getTables(): Promise<TableResponse[]> {
  const response = await apiClient.get<TableResponse[]>('/tables');
  return response.data;
}

export async function createTable(data: TableCreateRequest): Promise<TableResponse> {
  const response = await apiClient.post<TableResponse>('/tables', data);
  return response.data;
}

export async function updateTable(tableId: number, data: TableUpdateRequest): Promise<TableResponse> {
  const response = await apiClient.put<TableResponse>(`/tables/${tableId}`, data);
  return response.data;
}

export async function endTableSession(tableId: number): Promise<SessionEndResponse> {
  const response = await apiClient.post<SessionEndResponse>(`/tables/${tableId}/sessions/end`);
  return response.data;
}

export async function getOrderHistory(
  tableId: number,
  date?: string,
  page = 0,
): Promise<PagedResponse<OrderHistoryResponse>> {
  const params: Record<string, unknown> = { tableId, page, size: 20 };
  if (date) params.date = date;
  const response = await apiClient.get<PagedResponse<OrderHistoryResponse>>('/orders/history', { params });
  return response.data;
}
