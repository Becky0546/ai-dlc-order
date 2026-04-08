import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTableStore } from '../stores/useTableStore';
import { useCartTotalCount, useCartTotalAmount } from '../stores/useCartStore';

export default function CustomerLayout() {
  const { tableName } = useTableStore();
  const navigate = useNavigate();

  const cartItemCount = useCartTotalCount();
  const cartTotalAmount = useCartTotalAmount();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-10 border-b bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">테이블오더</span>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
            {tableName ?? '테이블'}
          </span>
        </div>
        <nav className="mt-2 flex gap-4">
          <NavLink
            to="/customer/menu"
            className={({ isActive }) =>
              `text-sm font-medium ${isActive ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-500'}`
            }
            data-testid="customer-nav-menu"
          >
            메뉴
          </NavLink>
          <NavLink
            to="/customer/orders"
            className={({ isActive }) =>
              `text-sm font-medium ${isActive ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-500'}`
            }
            data-testid="customer-nav-orders"
          >
            주문내역
          </NavLink>
        </nav>
      </header>

      {/* 페이지 콘텐츠 */}
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      {/* 하단 장바구니 플로팅 버튼 */}
      {cartItemCount > 0 && (
        <button
          onClick={() => navigate('/customer/cart')}
          className="fixed bottom-4 left-4 right-4 z-20 flex items-center justify-between rounded-xl bg-blue-600 px-6 py-4 text-white shadow-lg active:bg-blue-700"
          style={{ minHeight: '56px' }}
          data-testid="customer-cart-floating-button"
        >
          <span className="text-base font-semibold">
            장바구니 ({cartItemCount})
          </span>
          <span className="text-base font-bold">
            {cartTotalAmount.toLocaleString()}원
          </span>
        </button>
      )}
    </div>
  );
}
