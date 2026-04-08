import { useMutation } from '@tanstack/react-query';
import { createOrder } from '../api/orderApi';
import type { OrderCreateRequest } from '../types/order';

export function useCreateOrder() {
  return useMutation({
    mutationFn: (data: OrderCreateRequest) => createOrder(data),
  });
}
