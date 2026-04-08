import { create } from 'zustand';
import type { CartItem } from '../types/cart';

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  updateQuantity: (menuId: number, quantity: number) => void;
  removeItem: (menuId: number) => void;
  clear: () => void;
}

function saveToStorage(items: CartItem[]) {
  localStorage.setItem('cart_items', JSON.stringify(items));
}

function loadFromStorage(): CartItem[] {
  const stored = localStorage.getItem('cart_items');
  return stored ? JSON.parse(stored) : [];
}

export const useCartStore = create<CartState>((set, get) => ({
  items: loadFromStorage(),

  addItem: (item, quantity) => {
    const { items } = get();
    const existing = items.find((i) => i.menuId === item.menuId);

    let next: CartItem[];
    if (existing) {
      next = items.map((i) =>
        i.menuId === item.menuId
          ? { ...i, quantity: i.quantity + quantity }
          : i,
      );
    } else {
      next = [...items, { ...item, quantity }];
    }
    saveToStorage(next);
    set({ items: next });
  },

  updateQuantity: (menuId, quantity) => {
    if (quantity < 1) return;
    const next = get().items.map((i) =>
      i.menuId === menuId ? { ...i, quantity } : i,
    );
    saveToStorage(next);
    set({ items: next });
  },

  removeItem: (menuId) => {
    const next = get().items.filter((i) => i.menuId !== menuId);
    saveToStorage(next);
    set({ items: next });
  },

  clear: () => {
    localStorage.removeItem('cart_items');
    set({ items: [] });
  },
}));

export function useCartTotalAmount() {
  const items = useCartStore((s) => s.items);
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function useCartTotalCount() {
  const items = useCartStore((s) => s.items);
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
