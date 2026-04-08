import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

export default function AdminLayout() {
  const { storeName, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin/dashboard', label: '대시보드' },
    { to: '/admin/tables', label: '테이블 관리' },
    { to: '/admin/menus', label: '메뉴 관리' },
    { to: '/admin/history', label: '주문 이력' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {/* 상단 네비게이션 */}
      <header className="sticky top-0 z-10 border-b bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <span className="text-lg font-bold text-gray-900">
              {storeName ?? '매장 관리'}
            </span>
            <nav className="flex gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                  data-testid={`admin-nav-${item.to.split('/').pop()}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            data-testid="admin-logout-button"
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* 페이지 콘텐츠 */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
