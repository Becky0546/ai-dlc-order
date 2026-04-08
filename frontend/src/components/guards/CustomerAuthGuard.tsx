import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';

// TODO: 개발 확인용 임시 우회 - 배포 전 반드시 원복할 것
const DEV_BYPASS_AUTH = true;

export default function CustomerAuthGuard() {
  const { isAuthenticated, role } = useAuthStore();

  if (!DEV_BYPASS_AUTH && (!isAuthenticated || role !== 'TABLE')) {
    return <Navigate to="/customer/setup" replace />;
  }

  return <Outlet />;
}
