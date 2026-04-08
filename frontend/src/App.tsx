import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import router from './routes';
import ReLoginModal from './components/ReLoginModal';
import { useAuthStore } from './stores/useAuthStore';
import { useTableStore } from './stores/useTableStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  const restoreAuth = useAuthStore((s) => s.restoreFromStorage);
  const restoreTable = useTableStore((s) => s.restoreFromStorage);

  useEffect(() => {
    restoreAuth();
    restoreTable();
  }, [restoreAuth, restoreTable]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReLoginModal />
    </QueryClientProvider>
  );
}
