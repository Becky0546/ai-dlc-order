# FE-1 Frontend Components

## 1. CustomerLayout

**경로**: `src/layouts/CustomerLayout.tsx`

**구조**:
```
+------------------------------------------+
| [로고/매장명]              [테이블 번호]  |  ← 상단 헤더
+------------------------------------------+
|                                          |
|           <Outlet />                     |  ← 페이지 콘텐츠
|           (자식 라우트 렌더링)             |
|                                          |
|                                          |
+------------------------------------------+
|       [🛒 장바구니 (3) - 15,000원]        |  ← 하단 플로팅 버튼
+------------------------------------------+
```

**Props/State**:
- useTableStore에서 `tableName` 읽기
- useCartStore에서 `itemCount`, `totalAmount` 읽기 (FE-2에서 구현, 타입만 정의)
- 장바구니 플로팅 버튼 클릭 → `/customer/cart` 이동
- 장바구니 아이템 0개일 때 플로팅 버튼 숨김

**네비게이션 (상단 헤더)**:
- 메뉴 (`/customer/menu`) — 기본
- 주문내역 (`/customer/orders`)

---

## 2. AdminLayout

**경로**: `src/layouts/AdminLayout.tsx`

**구조**:
```
+------------------------------------------+
| [로고]  대시보드 | 테이블 | 메뉴 | 이력  |  ← 상단 네비게이션
|                              [로그아웃]  |
+------------------------------------------+
|                                          |
|           <Outlet />                     |
|                                          |
+------------------------------------------+
```

**Props/State**:
- useAuthStore에서 `storeName` 읽기
- 활성 메뉴 하이라이트 (현재 경로 기반)
- 로그아웃 버튼 → useAuthStore.logout() → `/admin/login`

**네비게이션 항목**:
| 라벨 | 경로 |
|---|---|
| 대시보드 | `/admin/dashboard` |
| 테이블 관리 | `/admin/tables` |
| 메뉴 관리 | `/admin/menus` |
| 주문 이력 | `/admin/history` |

---

## 3. TableSetupPage

**경로**: `src/pages/customer/TableSetupPage.tsx`
**라우트**: `/customer/setup`

**UI**:
```
+------------------------------------------+
|                                          |
|          테이블 오더 초기 설정             |
|                                          |
|   매장 코드:  [____________]             |
|   테이블 번호: [____________]             |
|   비밀번호:   [____________]             |
|                                          |
|          [설정 완료]                      |
|                                          |
|   ❌ 매장 정보가 올바르지 않습니다         |  ← 에러 시 표시
+------------------------------------------+
```

**State**:
```typescript
interface TableSetupForm {
  storeCode: string;
  tableNumber: string;
  tablePassword: string;
}
// 로딩, 에러 상태
isLoading: boolean;
error: string | null;
```

**User Interactions**:
1. 폼 입력 → 실시간 유효성 검증
2. "설정 완료" 클릭 → POST /api/v1/auth/table/login
3. 성공 → localStorage 저장 + store 업데이트 + /customer/menu 리다이렉트
4. 실패 → 에러 메시지 표시, 폼 유지

**API**: `POST /api/v1/auth/table/login` (TableLoginRequest → TableLoginResponse)

---

## 4. AdminLoginPage

**경로**: `src/pages/admin/AdminLoginPage.tsx`
**라우트**: `/admin/login`

**UI**:
```
+------------------------------------------+
|                                          |
|          관리자 로그인                     |
|                                          |
|   매장 코드:  [____________]             |
|   아이디:    [____________]              |
|   비밀번호:  [____________]              |
|                                          |
|          [로그인]                         |
|                                          |
|   ❌ 로그인 정보가 올바르지 않습니다        |  ← 에러 시 표시
+------------------------------------------+
```

**State**:
```typescript
interface AdminLoginForm {
  storeCode: string;
  username: string;
  password: string;
}
isLoading: boolean;
error: string | null;
```

**User Interactions**:
1. 폼 입력 → 실시간 유효성 검증
2. "로그인" 클릭 → POST /api/v1/auth/admin/login
3. 성공 → localStorage 저장 + store 업데이트 + /admin/dashboard 리다이렉트
4. 실패 → 에러 메시지 표시
5. Enter 키 → 로그인 실행

**API**: `POST /api/v1/auth/admin/login` (AdminLoginRequest → LoginResponse)

---

## 5. ReLoginModal

**경로**: `src/components/ReLoginModal.tsx`

**UI**:
```
+------------------------------------------+
|  ⚠️ 세션이 만료되었습니다                  |
|                                          |
|   아이디:    [____________]              |
|   비밀번호:  [____________]              |
|                                          |
|       [다시 로그인]    [로그아웃]          |
+------------------------------------------+
```

**Props**:
```typescript
interface ReLoginModalProps {
  isOpen: boolean;
  onSuccess: () => void;  // 재로그인 성공 → 원래 요청 재시도
  onCancel: () => void;   // 로그아웃 처리
}
```

**동작**:
- Axios 401 인터셉터에서 트리거
- storeCode는 useAuthStore에서 자동 채움 (재입력 불필요)
- "다시 로그인" → POST /api/v1/auth/admin/login → 성공 시 onSuccess 콜백
- "로그아웃" → onCancel → 토큰 삭제 + /admin/login 리다이렉트

---

## 6. useAuthStore (Zustand)

**경로**: `src/stores/useAuthStore.ts`

```typescript
interface AuthState {
  token: string | null;
  role: 'ADMIN' | 'TABLE' | null;
  expiresAt: string | null;
  storeName: string | null;
  storeCode: string | null;
  isAuthenticated: boolean;
  showReLoginModal: boolean;

  // Actions
  loginAdmin: (response: LoginResponse, storeCode: string) => void;
  loginTable: (response: TableLoginResponse) => void;
  logout: () => void;
  setShowReLoginModal: (show: boolean) => void;
  restoreFromStorage: () => void;  // 앱 초기화 시 localStorage 복원
}
```

**Persist**: localStorage 연동 (`auth_token`, `auth_role`, `auth_expires_at`, `store_code`, `store_name`)

---

## 7. useTableStore (Zustand)

**경로**: `src/stores/useTableStore.ts`

```typescript
interface TableState {
  storeId: number | null;
  tableId: number | null;
  tableName: string | null;
  sessionId: number | null;

  // Actions
  setTableInfo: (info: TableLoginResponse) => void;
  setSessionId: (sessionId: number) => void;
  clear: () => void;
  restoreFromStorage: () => void;
}
```

**Persist**: localStorage 연동 (`table_info`)

---

## 8. Axios Client + JWT Interceptor

**경로**: `src/api/client.ts`

**구성**:
```typescript
// Axios 인스턴스
const apiClient = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
});

// Request Interceptor: Authorization 헤더 추가
// Response Interceptor: 401 → role별 처리
//   ADMIN → showReLoginModal = true
//   TABLE → 자동 재로그인 시도 → 실패 시 /customer/setup
```

---

## 9. Route Configuration

**경로**: `src/routes/index.tsx`

```typescript
const routes = [
  // Customer
  { path: '/customer/setup', element: <TableSetupPage /> },
  {
    path: '/customer',
    element: <CustomerAuthGuard><CustomerLayout /></CustomerAuthGuard>,
    children: [
      { path: 'menu', element: <MenuPage /> },       // FE-2
      { path: 'cart', element: <CartPage /> },         // FE-2
      { path: 'order-success', element: <OrderSuccessPage /> }, // FE-3
      { path: 'orders', element: <OrderHistoryPage /> }, // FE-3
    ]
  },
  // Admin
  { path: '/admin/login', element: <AdminLoginPage /> },
  {
    path: '/admin',
    element: <AdminAuthGuard><AdminLayout /></AdminAuthGuard>,
    children: [
      { path: 'dashboard', element: <DashboardPage /> },  // FE-3
      { path: 'tables', element: <TableManagementPage /> }, // FE-4
      { path: 'menus', element: <MenuManagementPage /> },   // FE-4
      { path: 'history', element: <OrderHistoryPage /> },    // FE-4
    ]
  },
  // Default redirect
  { path: '/', element: <Navigate to="/customer/menu" /> },
];
```

**Auth Guards**:
- `CustomerAuthGuard`: role=TABLE & isAuthenticated → 통과, 아니면 → /customer/setup
- `AdminAuthGuard`: role=ADMIN & isAuthenticated → 통과, 아니면 → /admin/login
