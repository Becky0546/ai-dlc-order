import { create } from 'zustand';
import type { TableLoginResponse } from '../types/auth';

interface TableState {
  storeId: number | null;
  tableId: number | null;
  tableName: string | null;
  sessionId: number | null;

  setTableInfo: (info: TableLoginResponse) => void;
  setSessionId: (sessionId: number) => void;
  clear: () => void;
}

function loadInitialTableState() {
  const stored = localStorage.getItem('table_info');
  if (stored) {
    try {
      return JSON.parse(stored) as { storeId: number; tableId: number; tableName: string; sessionId: number | null };
    } catch {
      return null;
    }
  }
  return null;
}

const initial = loadInitialTableState();

export const useTableStore = create<TableState>((set) => ({
  storeId: initial?.storeId ?? null,
  tableId: initial?.tableId ?? null,
  tableName: initial?.tableName ?? null,
  sessionId: initial?.sessionId ?? null,

  setTableInfo: (info) => {
    const tableInfo = {
      storeId: info.storeId,
      tableId: info.tableId,
      tableName: info.tableName,
      sessionId: info.sessionId,
    };
    localStorage.setItem('table_info', JSON.stringify(tableInfo));
    set(tableInfo);
  },

  setSessionId: (sessionId) => {
    set({ sessionId });
    const stored = localStorage.getItem('table_info');
    if (stored) {
      const info = JSON.parse(stored);
      info.sessionId = sessionId;
      localStorage.setItem('table_info', JSON.stringify(info));
    }
  },

  clear: () => {
    localStorage.removeItem('table_info');
    set({ storeId: null, tableId: null, tableName: null, sessionId: null });
  },
}));
