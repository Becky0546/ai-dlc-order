# Application Design — 통합 문서

## 설계 결정 사항

| 항목 | 결정 |
|---|---|
| 백엔드 패키지 구조 | 혼합 — 도메인별 패키지 + 내부 레이어 분리 (order/controller/, order/service/) |
| 프론트엔드 상태 관리 | Zustand (전역 상태) + React Query (서버 상태/API 캐싱) |
| SSE 구현 | Spring MVC SseEmitter (MVC 앱과의 일관성, 단순성) |
| 이미지 업로드 | S3, 최대 2MB |
| API 버저닝 | URL 경로 기반 (/api/v1/) |

---

## 백엔드 컴포넌트 (8개 도메인 + 공통)

| 도메인 | 핵심 책임 | 주요 API |
|---|---|---|
| **auth** | 관리자/테이블 인증, JWT | POST /auth/admin/login, /auth/table/login |
| **store** | 매장 정보 | GET /stores/{id} |
| **table** | 테이블 CRUD, 세션 관리 | GET/POST /tables, POST /tables/{id}/sessions/end |
| **menu** | 메뉴/카테고리 CRUD, S3 이미지 | GET/POST/PUT/DELETE /menus, /categories |
| **order** | 주문 생성/조회/삭제/상태변경 | POST /orders, PATCH /orders/{id}/status |
| **recommendation** | 인구통계 수집, 추천 | POST /recommendations/demographic, GET /recommendations |
| **rating** | 별점 등록, 평균 계산 | POST /ratings, GET /ratings/menus |
| **sse** | 실시간 이벤트 스트리밍 | GET /sse/orders (SseEmitter) |
| **common** | JWT 필터, S3 설정, CORS, 예외처리 | — |

---

## 프론트엔드 구조

### 라우팅
```
/customer/setup       → 테이블 초기 설정
/customer/menu        → 메뉴 조회 (기본 화면)
/customer/cart        → 장바구니
/customer/order-success → 주문 완료 (5초 후 리다이렉트)
/customer/orders      → 주문 내역

/admin/login          → 관리자 로그인
/admin/dashboard      → 실시간 주문 모니터링
/admin/tables         → 테이블 관리
/admin/history        → 과거 주문 내역
/admin/menus          → 메뉴 관리
```

### 상태 관리
- **Zustand**: useAuthStore, useCartStore (localStorage), useTableStore
- **React Query**: 메뉴/주문/추천/평점 조회 및 mutation
- **Custom Hook**: useSSE (관리자 EventSource 연결)

---

## 핵심 서비스 상호작용

```
OrderService ──> MenuService          (메뉴/가격 검증)
OrderService ──> TableSessionService  (세션 확인/자동 시작)
OrderService ──> SseService           (이벤트 브로드캐스트)
TableSessionService ──> OrderRepository (이력 아카이브 — 순환 의존 방지)
MenuService ──> ImageService          (S3 업로드/삭제)
AuthService ──> StoreService, TableService (검증)
```

### 순환 의존 방지
- OrderService ↔ TableSessionService 간 잠재적 순환 의존
- 해결: TableSessionService는 OrderRepository를 직접 참조하여 이력 아카이브 수행

---

## 상세 참조
- [components.md](components.md) — 컴포넌트 정의 및 인터페이스
- [component-methods.md](component-methods.md) — 메서드 시그니처 및 DTO
- [services.md](services.md) — 서비스 정의 및 오케스트레이션
- [component-dependency.md](component-dependency.md) — 의존성 및 데이터 흐름
