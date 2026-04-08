import { Link } from 'react-router-dom';
import { useCartStore, useCartTotalAmount } from '../../stores/useCartStore';

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const totalAmount = useCartTotalAmount();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12">
        <p className="text-lg text-gray-400">장바구니가 비어있습니다</p>
        <Link
          to="/customer/menu"
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          data-testid="cart-go-to-menu"
        >
          메뉴 보러가기
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-4">
      <div className="px-4 pt-4">
        <h1 className="text-lg font-bold text-gray-900">장바구니</h1>
      </div>

      {/* 장바구니 아이템 목록 */}
      <ul className="mt-3 divide-y">
        {items.map((item) => (
          <li key={item.menuId} className="flex items-center gap-3 px-4 py-3" data-testid={`cart-item-${item.menuId}`}>
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.menuName} className="h-16 w-16 rounded-lg object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                No Img
              </div>
            )}

            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{item.menuName}</p>
              <p className="text-sm text-gray-500">{item.price.toLocaleString()}원</p>
            </div>

            {/* 수량 조절 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  item.quantity > 1
                    ? updateQuantity(item.menuId, item.quantity - 1)
                    : removeItem(item.menuId)
                }
                className="flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold text-gray-600"
                data-testid={`cart-item-minus-${item.menuId}`}
              >
                -
              </button>
              <span className="min-w-[1.5rem] text-center text-sm font-bold">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.menuId, item.quantity + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold text-gray-600"
                data-testid={`cart-item-plus-${item.menuId}`}
              >
                +
              </button>
            </div>

            {/* 소계 + 삭제 */}
            <div className="flex flex-col items-end gap-1">
              <span className="text-sm font-bold text-gray-900">
                {(item.price * item.quantity).toLocaleString()}원
              </span>
              <button
                onClick={() => removeItem(item.menuId)}
                className="text-xs text-red-500 hover:text-red-700"
                data-testid={`cart-item-remove-${item.menuId}`}
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* 총 금액 */}
      <div className="mx-4 mt-4 flex items-center justify-between rounded-lg bg-gray-100 px-4 py-3">
        <span className="text-base font-medium text-gray-700">총 금액</span>
        <span className="text-xl font-bold text-gray-900">{totalAmount.toLocaleString()}원</span>
      </div>
    </div>
  );
}
