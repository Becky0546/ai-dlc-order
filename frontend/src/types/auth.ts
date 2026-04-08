export interface AdminLoginRequest {
  storeCode: string;
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  storeName: string;
}

export interface TableLoginRequest {
  storeCode: string;
  tableNumber: number;
  tablePassword: string;
}

export interface TableLoginResponse {
  token: string;
  storeId: number;
  tableId: number;
  tableName: string;
  sessionId: number | null;
}

export interface TableCredentials {
  storeCode: string;
  tableNumber: number;
  tablePassword: string;
}
