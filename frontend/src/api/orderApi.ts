import apiClient from './client';
import type { OrderCreateRequest, OrderResponse } from '../types/order';

export async function createOrder(data: OrderCreateRequest): Promise<OrderResponse> {
  const response = await apiClient.post<OrderResponse>('/orders', data);
  return response.data;
}
