import apiClient from './client';
import type { OrderCreateRequest, OrderResponse } from '../types/order';

export async function createOrder(data: OrderCreateRequest): Promise<OrderResponse> {
  const response = await apiClient.post<OrderResponse>('/orders', data);
  return response.data;
}

export async function deleteOrder(orderId: number): Promise<void> {
  await apiClient.delete(`/orders/${orderId}`);
}

export async function updateOrderStatus(orderId: number, status: string): Promise<OrderResponse> {
  const response = await apiClient.patch<OrderResponse>(`/orders/${orderId}/status`, { status });
  return response.data;
}
