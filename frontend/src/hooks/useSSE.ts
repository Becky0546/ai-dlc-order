import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useSSE() {
  const queryClient = useQueryClient();
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource('/api/v1/sse/orders');
    eventSourceRef.current = es;

    const handleEvent = () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    };

    es.addEventListener('NEW_ORDER', handleEvent);
    es.addEventListener('ORDER_STATUS_CHANGED', handleEvent);
    es.addEventListener('ORDER_DELETED', handleEvent);

    es.onerror = () => {
      es.close();
      setTimeout(() => {
        eventSourceRef.current = new EventSource('/api/v1/sse/orders');
      }, 3000);
    };

    return () => {
      es.close();
    };
  }, [queryClient]);
}
