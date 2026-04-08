# Components

## Backend Components (Spring Boot — 도메인별 혼합 패키지 구조)

### 1. auth
**책임**: 관리자 및 테이블 디바이스 인증/인가
- 관리자 로그인 (매장 식별자 + 사용자명 + 비밀번호)
- JWT 토큰 발급 및 검증 (16시간 세션)
- 테이블 디바이스 인증 (매장ID + 테이블번호 + 비밀번호)
- 로그인 시도 제한

**인터페이스**:
- `POST /api/v1/auth/admin/login` — 관리자 로그인
- `POST /api/v1/auth/table/login` — 테이블 디바이스 로그인
- `POST /api/v1/auth/refresh` — 토큰 갱신

### 2. store
**책임**: 매장 정보 관리
- 매장 기본 정보 조회

**인터페이스**:
- `GET /api/v1/stores/{storeId}` — 매장 정보 조회

### 3. table
**책임**: 테이블 관리 및 세션 라이프사이클
- 테이블 CRUD 및 초기 설정
- 테이블 세션 시작/종료
- 이용 완료 시 주문 이력 이동 및 리셋

**인터페이스**:
- `GET /api/v1/tables` — 테이블 목록 조회
- `POST /api/v1/tables` — 테이블 등록 (초기 설정)
- `PUT /api/v1/tables/{tableId}` — 테이블 정보 수정
- `POST /api/v1/tables/{tableId}/sessions/end` — 테이블 이용 완료 (세션 종료)
- `GET /api/v1/tables/{tableId}/session` — 현재 세션 정보 조회

### 4. menu
**책임**: 메뉴 및 카테고리 CRUD, 이미지 관리
- 카테고리별 메뉴 조회
- 메뉴 등록/수정/삭제
- 메뉴 노출 순서 조정
- S3 이미지 업로드/삭제

**인터페이스**:
- `GET /api/v1/menus` — 메뉴 목록 조회 (카테고리별)
- `GET /api/v1/menus/{menuId}` — 메뉴 상세 조회
- `POST /api/v1/menus` — 메뉴 등록
- `PUT /api/v1/menus/{menuId}` — 메뉴 수정
- `DELETE /api/v1/menus/{menuId}` — 메뉴 삭제
- `PUT /api/v1/menus/order` — 메뉴 순서 변경
- `POST /api/v1/menus/{menuId}/image` — 이미지 업로드
- `GET /api/v1/categories` — 카테고리 목록 조회
- `POST /api/v1/categories` — 카테고리 등록
- `PUT /api/v1/categories/{categoryId}` — 카테고리 수정
- `DELETE /api/v1/categories/{categoryId}` — 카테고리 삭제

### 5. order
**책임**: 주문 생성, 조회, 삭제, 상태 관리
- 주문 생성 (장바구니 → 주문 전환)
- 현재 세션 주문 목록 조회
- 주문 삭제 (관리자 직권)
- 주문 상태 변경 (대기중/준비중/완료)
- 과거 주문 이력 조회

**인터페이스**:
- `POST /api/v1/orders` — 주문 생성
- `GET /api/v1/orders?tableId={tableId}&sessionId={sessionId}` — 현재 세션 주문 조회
- `GET /api/v1/orders/{orderId}` — 주문 상세 조회
- `DELETE /api/v1/orders/{orderId}` — 주문 삭제 (관리자)
- `PATCH /api/v1/orders/{orderId}/status` — 주문 상태 변경 (관리자)
- `GET /api/v1/orders/history?tableId={tableId}` — 과거 주문 이력 조회
- `GET /api/v1/orders/dashboard` — 관리자 대시보드 (테이블별 주문 현황)

### 6. recommendation
**책임**: 인구통계 데이터 수집 및 메뉴 추천
- 주문 완료 후 성별/나이대 데이터 수집 및 저장
- 동일 인구통계 기반 인기 메뉴 추천
- 데이터 부족 시 전체 인기 메뉴 폴백

**인터페이스**:
- `POST /api/v1/recommendations/demographic` — 인구통계 데이터 저장 (주문 완료 후)
- `GET /api/v1/recommendations?gender={gender}&ageGroup={ageGroup}` — 추천 메뉴 조회

### 7. rating
**책임**: 메뉴별 별점 평가 관리
- 주문 완료 후 메뉴별 별점 등록
- 메뉴별 평균 별점 계산
- 평가 데이터 조회

**인터페이스**:
- `POST /api/v1/ratings` — 별점 등록 (주문 완료 후)
- `GET /api/v1/ratings/menus/{menuId}` — 메뉴별 평균 별점 조회
- `GET /api/v1/ratings/menus` — 전체 메뉴 평균 별점 목록

### 8. sse
**책임**: 관리자용 실시간 이벤트 스트리밍
- SSE 연결 관리 (SseEmitter)
- 신규 주문 이벤트 브로드캐스트
- 주문 상태 변경 이벤트 브로드캐스트
- 연결 타임아웃 및 재연결 처리

**인터페이스**:
- `GET /api/v1/sse/orders` — SSE 스트림 구독 (관리자)

### 9. common (공통 모듈)
**책임**: 횡단 관심사
- JWT 필터 및 보안 설정
- S3 클라이언트 설정
- CORS 설정
- 전역 예외 처리
- API 응답 형식 표준화

---

## Frontend Components (React TypeScript)

### Customer Pages
| 컴포넌트 | 경로 | 책임 |
|---|---|---|
| TableSetupPage | /customer/setup | 테이블 초기 설정 (1회) |
| MenuPage | /customer/menu | 메뉴 목록 조회, 카테고리 탐색 |
| CartPage | /customer/cart | 장바구니 관리, 주문 확정 |
| OrderSuccessPage | /customer/order-success | 주문 완료 (5초 후 자동 리다이렉트) |
| OrderHistoryPage | /customer/orders | 현재 세션 주문 내역 |
| RecommendationModal | (모달) | 1분 후 자동 표시, 성별/나이대 입력 → 추천 |
| DemographicModal | (모달) | 주문 완료 후 성별/나이대 선택 |
| RatingModal | (모달) | 주문 완료 후 메뉴별 별점 평가 |

### Admin Pages
| 컴포넌트 | 경로 | 책임 |
|---|---|---|
| AdminLoginPage | /admin/login | 관리자 로그인 |
| DashboardPage | /admin/dashboard | 실시간 주문 모니터링 (테이블별 그리드) |
| TableDetailModal | (모달) | 테이블 주문 상세, 상태 변경, 삭제 |
| TableManagementPage | /admin/tables | 테이블 설정, 세션 관리, 이용 완료 |
| OrderHistoryPage | /admin/history | 과거 주문 내역 조회 (날짜 필터) |
| MenuManagementPage | /admin/menus | 메뉴 CRUD, 이미지 업로드, 순서 조정 |

### Shared Components
| 컴포넌트 | 책임 |
|---|---|
| Layout | 고객용/관리자용 레이아웃 |
| MenuCard | 메뉴 카드 (이미지, 이름, 가격, 별점) |
| OrderCard | 주문 카드 (주문 정보 축약 표시) |
| TableCard | 테이블 카드 (대시보드용, 총 주문액, 미리보기) |
| ConfirmDialog | 확인 팝업 (삭제, 이용 완료 등) |
| StarRating | 별점 표시/입력 컴포넌트 |

### State Management
| Store/Hook | 라이브러리 | 책임 |
|---|---|---|
| useAuthStore | Zustand | 인증 상태 (JWT 토큰, 로그인 여부) |
| useCartStore | Zustand | 장바구니 상태 (메뉴 목록, 수량, 총액) — localStorage 연동 |
| useTableStore | Zustand | 테이블/세션 정보 (테이블 ID, 세션 ID) |
| useMenus | React Query | 메뉴 목록 조회/캐싱 |
| useOrders | React Query | 주문 목록 조회 |
| useCreateOrder | React Query (mutation) | 주문 생성 |
| useRecommendations | React Query | 추천 메뉴 조회 |
| useSSE | Custom Hook | SSE 연결 관리 (관리자용) |
