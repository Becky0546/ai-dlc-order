import { useQuery } from '@tanstack/react-query';
import { getOrderHistory } from '../api/tableApi';

export function useOrderHistory(tableId: number | null, date?: string, page = 0) {
  return useQuery({
    queryKey: ['orderHistory', tableId, date, page],
    queryFn: () => getOrderHistory(tableId!, date, page),
    enabled: !!tableId,
  });
}
