import { create } from 'zustand';
import type { LoginResponse, TableLoginResponse } from '../types/auth';

interface AuthState {
  token: string | null;
  role: 'ADMIN' | 'TABLE' | null;
  expiresAt: string | null;
  storeName: string | null;
  storeCode: string | null;
  isAuthenticated: boolean;
  showReLoginModal: boolean;

  loginAdmin: (response: LoginResponse, storeCode: string) => void;
  loginTable: (response: TableLoginResponse) => void;
  logout: () => void;
  setShowReLoginModal: (show: boolean) => void;
  restoreFromStorage: () => boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  expiresAt: null,
  storeName: null,
  storeCode: null,
  isAuthenticated: false,
  showReLoginModal: false,

  loginAdmin: (response, storeCode) => {
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('auth_role', 'ADMIN');
    localStorage.setItem('auth_expires_at', response.expiresAt);
    localStorage.setItem('store_name', response.storeName);
    localStorage.setItem('store_code', storeCode);

    set({
      token: response.token,
      role: 'ADMIN',
      expiresAt: response.expiresAt,
      storeName: response.storeName,
      storeCode,
      isAuthenticated: true,
    });
  },

  loginTable: (response) => {
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('auth_role', 'TABLE');

    set({
      token: response.token,
      role: 'TABLE',
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_role');
    localStorage.removeItem('auth_expires_at');
    localStorage.removeItem('store_name');
    localStorage.removeItem('store_code');

    set({
      token: null,
      role: null,
      expiresAt: null,
      storeName: null,
      storeCode: null,
      isAuthenticated: false,
      showReLoginModal: false,
    });
  },

  setShowReLoginModal: (show) => set({ showReLoginModal: show }),

  restoreFromStorage: () => {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('auth_role') as 'ADMIN' | 'TABLE' | null;

    if (token && role) {
      set({
        token,
        role,
        expiresAt: localStorage.getItem('auth_expires_at'),
        storeName: localStorage.getItem('store_name'),
        storeCode: localStorage.getItem('store_code'),
        isAuthenticated: true,
      });
      return true;
    }
    return false;
  },
}));
