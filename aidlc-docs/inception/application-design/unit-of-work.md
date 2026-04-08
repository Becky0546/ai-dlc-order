# Unit of Work (Frontend)

## 기술 스택
- **빌드**: Vite + React 18 + TypeScript
- **스타일링**: Tailwind CSS
- **상태 관리**: Zustand (전역) + React Query (서버)
- **라우팅**: React Router v6
- **HTTP**: Axios
- **작업 디렉토리**: `frontend/`

---

## Unit FE-1: 프로젝트 설정 + 인증

**범위**: 프로젝트 초기 세팅 및 인증 화면

**포함 항목**:
| 구분 | 항목 |
|---|---|
| **Pages** | TableSetupPage (`/customer/setup`), AdminLoginPage (`/admin/login`) |
| **Components** | CustomerLayout, AdminLayout |
| **Stores** | useAuthStore (Zustand), useTableStore (Zustand) |
| **Config** | Vite 설정, Tailwind 설정, React Router, Axios 인스턴스, JWT 인터셉터, React Query Provider |

**산출물**:
```
frontend/
+-- index.html
+-- vite.config.ts
+-- tailwind.config.js
+-- postcss.config.js
+-- tsconfig.json
+-- package.json
+-- src/
    +-- main.tsx
    +-- App.tsx
    +-- routes/
    |   +-- index.tsx
    +-- api/
    |   +-- client.ts              (Axios 인스턴스 + JWT 인터셉터)
    +-- stores/
    |   +-- useAuthStore.ts
    |   +-- useTableStore.ts
    +-- layouts/
    |   +-- CustomerLayout.tsx
    |   +-- AdminLayout.tsx
    +-- pages/
    |   +-- customer/
    |   |   +-- TableSetupPage.tsx
    |   +-- admin/
    |       +-- AdminLoginPage.tsx
    +-- types/
        +-- auth.ts
```

---

## Unit FE-2: 메뉴 + 장바구니

**범위**: 고객 메뉴 탐색 및 장바구니 관리

**포함 항목**:
| 구분 | 항목 |
|---|---|
| **Pages** | MenuPage (`/customer/menu`), CartPage (`/customer/cart`) |
| **Components** | MenuCard, StarRating (표시 전용) |
| **Stores** | useCartStore (Zustand, localStorage 연동) |
| **Hooks** | useMenus, useCategories (React Query) |
| **API** | `GET /api/v1/menus`, `GET /api/v1/categories`, `GET /api/v1/ratings/menus` |

**산출물**:
```
src/
+-- pages/customer/
|   +-- MenuPage.tsx
|   +-- CartPage.tsx
+-- components/
|   +-- MenuCard.tsx
|   +-- StarRating.tsx
+-- stores/
|   +-- useCartStore.ts
+-- hooks/
|   +-- useMenus.ts
|   +-- useCategories.ts
+-- api/
|   +-- menuApi.ts
+-- types/
    +-- menu.ts
    +-- cart.ts
```

---

## Unit FE-3: 주문 + 대시보드

**범위**: 주문 생성/조회 (고객) + 실시간 모니터링 (관리자)

**포함 항목**:
| 구분 | 항목 |
|---|---|
| **Pages** | OrderSuccessPage (`/customer/order-success`), OrderHistoryPage (`/customer/orders`), DashboardPage (`/admin/dashboard`) |
| **Components** | OrderCard, TableCard, TableDetailModal |
| **Hooks** | useOrders, useCreateOrder (React Query), useSSE (Custom Hook) |
| **API** | `POST /api/v1/orders`, `GET /api/v1/orders`, `GET /api/v1/orders/dashboard`, `GET /api/v1/sse/orders`, `PATCH /api/v1/orders/{id}/status`, `DELETE /api/v1/orders/{id}` |

**산출물**:
```
src/
+-- pages/
|   +-- customer/
|   |   +-- OrderSuccessPage.tsx
|   |   +-- OrderHistoryPage.tsx
|   +-- admin/
|       +-- DashboardPage.tsx
+-- components/
|   +-- OrderCard.tsx
|   +-- TableCard.tsx
|   +-- TableDetailModal.tsx
+-- hooks/
|   +-- useOrders.ts
|   +-- useCreateOrder.ts
|   +-- useSSE.ts
+-- api/
|   +-- orderApi.ts
|   +-- sseApi.ts
+-- types/
    +-- order.ts
    +-- dashboard.ts
```

---

## Unit FE-4: 관리자 관리

**범위**: 테이블 관리, 과거 주문 이력, 메뉴 CRUD

**포함 항목**:
| 구분 | 항목 |
|---|---|
| **Pages** | TableManagementPage (`/admin/tables`), AdminOrderHistoryPage (`/admin/history`), MenuManagementPage (`/admin/menus`) |
| **Components** | ConfirmDialog |
| **Hooks** | useTables, useOrderHistory, useMenuMutations (React Query) |
| **API** | `GET/POST/PUT /api/v1/tables`, `POST /api/v1/tables/{id}/sessions/end`, `GET /api/v1/orders/history`, `POST/PUT/DELETE /api/v1/menus`, `POST /api/v1/menus/{id}/image`, `GET/POST/PUT/DELETE /api/v1/categories` |

**산출물**:
```
src/
+-- pages/admin/
|   +-- TableManagementPage.tsx
|   +-- AdminOrderHistoryPage.tsx
|   +-- MenuManagementPage.tsx
+-- components/
|   +-- ConfirmDialog.tsx
+-- hooks/
|   +-- useTables.ts
|   +-- useOrderHistory.ts
|   +-- useMenuMutations.ts
+-- api/
|   +-- tableApi.ts
|   +-- menuAdminApi.ts
+-- types/
    +-- table.ts
```

---

## Unit FE-5: 추천/평가

**범위**: 성별/나이대 기반 메뉴 추천 + 별점 평가

**포함 항목**:
| 구분 | 항목 |
|---|---|
| **Components** | RecommendationModal, DemographicModal, RatingModal |
| **Hooks** | useRecommendations, useRatings (React Query) |
| **API** | `POST /api/v1/recommendations/demographic`, `GET /api/v1/recommendations`, `POST /api/v1/ratings` |
| **Logic** | 1분 타이머 (메뉴 화면 진입 후 자동 모달), 주문 완료 후 인구통계 수집 + 별점 평가 플로우 |

**산출물**:
```
src/
+-- components/
|   +-- RecommendationModal.tsx
|   +-- DemographicModal.tsx
|   +-- RatingModal.tsx
+-- hooks/
|   +-- useRecommendations.ts
|   +-- useRatings.ts
|   +-- useRecommendationTimer.ts
+-- api/
|   +-- recommendationApi.ts
|   +-- ratingApi.ts
+-- types/
    +-- recommendation.ts
    +-- rating.ts
```
