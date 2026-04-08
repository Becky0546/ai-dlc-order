# FE-1 Domain Entities (TypeScript Types)

## Auth Types

```typescript
// 관리자 로그인
interface AdminLoginRequest {
  storeCode: string;
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  expiresAt: string; // ISO 8601
  storeName: string;
}

// 테이블 디바이스 로그인
interface TableLoginRequest {
  storeCode: string;
  tableNumber: number;
  tablePassword: string;
}

interface TableLoginResponse {
  token: string;
  storeId: number;
  tableId: number;
  tableName: string;
  sessionId: number | null; // 세션 없으면 null
}

// 토큰 정보
interface TokenInfo {
  token: string;
  expiresAt: string;
  role: 'ADMIN' | 'TABLE';
}
```

## Store Types

```typescript
interface StoreInfo {
  id: number;
  name: string;
  code: string;
  address: string;
}
```

## Table Types

```typescript
interface TableInfo {
  id: number;
  number: number;
  name: string;
  currentSessionId: number | null;
}

interface SessionInfo {
  sessionId: number;
  startedAt: string;
  tableId: number;
  totalOrderAmount: number;
}
```

## API Error Response

```typescript
interface ApiError {
  status: number;
  message: string;
  code: string; // e.g. 'AUTH_FAILED', 'SESSION_EXPIRED', 'LOGIN_LOCKED'
}
```
