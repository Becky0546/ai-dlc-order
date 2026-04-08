import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTableStore } from '../stores/useTableStore';
import { useCartStore, useCartTotalCount, useCartTotalAmount } from '../stores/useCartStore';
import { useCreateOrder } from '../hooks/useCreateOrder';

export default function CustomerLayout() {
  const { tableName, tableId } = useTableStore();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItems = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const cartItemCount = useCartTotalCount();
  const cartTotalAmount = useCartTotalAmount();
  const createOrder = useCreateOrder();
  const [error, setError] = useState<string | null>(null);

  const isCartPage = location.pathname === '/customer/cart';

  const handleOrder = () => {
    if (!tableId || cartItems.length === 0) return;
    setError(null);

    createOrder.mutate(
      {
        tableId,
        items: cartItems.map((i) => ({ menuId: i.menuId, quantity: i.quantity })),
      },
      {
        onSuccess: (data) => {
          clearCart();
          navigate(`/customer/order-success?orderId=${data.orderId}&orderNumber=${data.orderNumber}`, { replace: true });
        },
        onError: () => {
          setError('주문에 실패했습니다. 다시 시도해주세요.');
        },
      },
    );
  };

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

      {/* 에러 메시지 */}
      {error && (
        <div className="fixed bottom-20 left-4 right-4 z-30 rounded-lg bg-red-100 px-4 py-2 text-center text-sm text-red-700">
          {error}
        </div>
      )}

      {/* 하단 플로팅 버튼 - 장바구니/주문하기 전환 */}
      {cartItemCount > 0 && (
        <button
          onClick={isCartPage ? handleOrder : () => navigate('/customer/cart')}
          disabled={isCartPage && createOrder.isPending}
          className="fixed bottom-4 left-4 right-4 z-20 flex items-center justify-between rounded-xl bg-blue-600 px-6 py-4 text-white shadow-lg active:bg-blue-700 disabled:bg-gray-400"
          style={{ minHeight: '56px' }}
          data-testid={isCartPage ? 'customer-order-button' : 'customer-cart-floating-button'}
        >
          <span className="text-base font-semibold">
            {isCartPage
              ? (createOrder.isPending ? '주문 중...' : '주문하기')
              : `장바구니 (${cartItemCount})`
            }
          </span>
          <span className="text-base font-bold">
            {cartTotalAmount.toLocaleString()}원
          </span>
        </button>
      )}
    </div>
  );
}
