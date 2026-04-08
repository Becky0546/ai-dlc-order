import { useState } from 'react';
import type { Menu } from '../types/menu';
import StarRating from './StarRating';

interface MenuDetailModalProps {
  menu: Menu;
  onClose: () => void;
  onAddToCart: (menu: Menu, quantity: number) => void;
}

export default function MenuDetailModal({ menu, onClose, onAddToCart }: MenuDetailModalProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    onAddToCart(menu, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-2xl bg-white sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 이미지 */}
        {menu.imageUrl ? (
          <img src={menu.imageUrl} alt={menu.name} className="h-56 w-full rounded-t-2xl object-cover" />
        ) : (
          <div className="flex h-56 w-full items-center justify-center rounded-t-2xl bg-gray-100 text-gray-400">
            No Image
          </div>
        )}

        <div className="p-5">
          {/* 메뉴 정보 */}
          <h2 className="text-xl font-bold text-gray-900">{menu.name}</h2>
          <p className="mt-1 text-2xl font-bold text-blue-600">{menu.price.toLocaleString()}원</p>

          {menu.averageRating > 0 && (
            <div className="mt-2">
              <StarRating score={menu.averageRating} size="md" />
            </div>
          )}

          {menu.description && (
            <p className="mt-3 text-sm text-gray-600">{menu.description}</p>
          )}

          {/* 수량 선택 */}
          <div className="mt-5 flex items-center justify-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-lg font-bold text-gray-700 hover:bg-gray-50 active:bg-gray-100"
              data-testid="menu-detail-quantity-minus"
            >
              -
            </button>
            <span className="min-w-[2rem] text-center text-xl font-bold" data-testid="menu-detail-quantity">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-lg font-bold text-gray-700 hover:bg-gray-50 active:bg-gray-100"
              data-testid="menu-detail-quantity-plus"
            >
              +
            </button>
          </div>

          {/* 담기 버튼 */}
          <button
            onClick={handleAdd}
            className="mt-5 w-full rounded-xl bg-blue-600 py-4 text-base font-semibold text-white hover:bg-blue-700 active:bg-blue-800"
            style={{ minHeight: '48px' }}
            data-testid="menu-detail-add-to-cart"
          >
            {(menu.price * quantity).toLocaleString()}원 담기
          </button>
        </div>
      </div>
    </div>
  );
}
