# FE-1 Code Generation Plan

**Unit**: FE-1 (프로젝트 설정 + 인증)
**코드 위치**: `frontend/` (workspace root 기준)
**기능 요구사항**: FR-C01 (테이블 자동 로그인), FR-A01 (관리자 인증)

---

## Unit Context

- **기술 스택**: Vite + React 18 + TypeScript + Tailwind CSS
- **상태 관리**: Zustand (전역) + React Query (서버)
- **라우팅**: React Router v6
- **HTTP**: Axios
- **의존 유닛**: 없음 (FE-1은 기반 유닛)
- **설계 참고**: `aidlc-docs/construction/fe-1-setup-auth/functional-design/`

---

## Generation Steps

### Step 1: 프로젝트 초기화 및 설정 파일
- [x] Vite + React + TypeScript 프로젝트 생성 (`frontend/`)
- [x] `package.json` — 의존성 정의 (react, react-dom, react-router-dom, axios, zustand, @tanstack/react-query, tailwindcss)
- [x] `vite.config.ts` — Vite 설정 (proxy 포함)
- [x] `tailwind.config.js` + `postcss.config.js` — Tailwind 설정
- [x] `tsconfig.json` — TypeScript 설정
- [x] `index.html` — 엔트리 HTML
- [x] `src/index.css` — Tailwind 디렉티브

### Step 2: TypeScript 타입 정의
- [x] `src/types/auth.ts` — AdminLoginRequest, LoginResponse, TableLoginRequest, TableLoginResponse, TokenInfo
- [x] `src/types/common.ts` — ApiError

### Step 3: API 클라이언트 + JWT 인터셉터
- [x] `src/api/client.ts` — Axios 인스턴스, baseURL, timeout, JWT request/response 인터셉터

### Step 4: Zustand Stores
- [x] `src/stores/useAuthStore.ts` — token, role, isAuthenticated, loginAdmin, loginTable, logout, restoreFromStorage, showReLoginModal
- [x] `src/stores/useTableStore.ts` — storeId, tableId, tableName, sessionId, setTableInfo, clear, restoreFromStorage

### Step 5: Auth API 함수
- [x] `src/api/authApi.ts` — adminLogin, tableLogin, refreshToken 함수

### Step 6: Auth Guards
- [x] `src/components/guards/CustomerAuthGuard.tsx` — TABLE 인증 확인, 미인증 시 /customer/setup
- [x] `src/components/guards/AdminAuthGuard.tsx` — ADMIN 인증 확인, 미인증 시 /admin/login

### Step 7: Layouts
- [x] `src/layouts/CustomerLayout.tsx` — 상단 헤더 (매장명, 테이블번호, 네비게이션) + 하단 장바구니 플로팅 버튼 + Outlet
- [x] `src/layouts/AdminLayout.tsx` — 상단 네비게이션 (대시보드/테이블/메뉴/이력/로그아웃) + Outlet

### Step 8: Pages
- [x] `src/pages/customer/TableSetupPage.tsx` — 테이블 초기 설정 폼 (storeCode, tableNumber, tablePassword)
- [x] `src/pages/admin/AdminLoginPage.tsx` — 관리자 로그인 폼 (storeCode, username, password)

### Step 9: ReLoginModal
- [x] `src/components/ReLoginModal.tsx` — 관리자 세션 만료 시 재로그인 모달

### Step 10: 라우트 설정 + App 엔트리
- [x] `src/routes/index.tsx` — 전체 라우트 정의 (customer/admin 분리, guards 적용)
- [x] `src/App.tsx` — QueryClientProvider, RouterProvider, ReLoginModal, 앱 초기화 (localStorage 복원)
- [x] `src/main.tsx` — ReactDOM 렌더링

### Step 11: Placeholder 페이지 (후속 유닛용)
- [x] `src/pages/customer/MenuPage.tsx` — "메뉴 페이지 (FE-2)" placeholder
- [x] `src/pages/customer/CartPage.tsx` — "장바구니 (FE-2)" placeholder
- [x] `src/pages/customer/OrderSuccessPage.tsx` — placeholder (FE-3)
- [x] `src/pages/customer/OrderHistoryPage.tsx` — placeholder (FE-3)
- [x] `src/pages/admin/DashboardPage.tsx` — placeholder (FE-3)
- [x] `src/pages/admin/TableManagementPage.tsx` — placeholder (FE-4)
- [x] `src/pages/admin/MenuManagementPage.tsx` — placeholder (FE-4)
- [x] `src/pages/admin/AdminOrderHistoryPage.tsx` — placeholder (FE-4)
