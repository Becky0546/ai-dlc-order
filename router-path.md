# Router Path

프론트엔드 전체 라우트 정보

---

## Customer (고객용)

| Path | Page | 인증 | 설명 |
|---|---|---|---|
| `/customer/setup` | TableSetupPage | 불필요 | 테이블 초기 설정 (매장코드, 테이블번호, 비밀번호 입력). 인증 정보 없을 때 자동 표시. 이미 인증되면 `/customer/menu`로 리다이렉트 |
| `/customer/menu` | MenuPage | TABLE | 메뉴 조회. 카테고리 탭 + 2열 메뉴 그리드. 메뉴 클릭 → 상세 모달 → 수량 선택 → 장바구니 담기. 1분 후 추천 모달 자동 팝업 |
| `/customer/cart` | CartPage | TABLE | 장바구니. 수량 조절/삭제, 총 금액 표시, "주문하기" 버튼으로 바로 주문 API 호출 |
| `/customer/order-success` | OrderSuccessPage | TABLE | 주문 완료 화면. 주문번호 표시, 5초 카운트다운 후 `/customer/menu`로 자동 리다이렉트. Query: `?orderId={id}&orderNumber={number}` |
| `/customer/orders` | OrderHistoryPage | TABLE | 현재 세션 주문 내역. 시간 역순 정렬, OrderCard로 표시 |

## Admin (관리자용)

| Path | Page | 인증 | 설명 |
|---|---|---|---|
| `/admin/login` | AdminLoginPage | 불필요 | 관리자 로그인 (매장코드, 아이디, 비밀번호). JWT 16시간 세션. 이미 인증되면 `/admin/dashboard`로 리다이렉트 |
| `/admin/dashboard` | DashboardPage | ADMIN | 실시간 주문 모니터링. SSE 연결, 테이블별 그리드(TableCard). 테이블 클릭 → TableDetailModal(주문 상태 변경, 삭제) |
| `/admin/tables` | TableManagementPage | ADMIN | 테이블 관리. 테이블 추가, 이용 완료(세션 종료 + 주문 이력 이동) |
| `/admin/menus` | MenuManagementPage | ADMIN | 메뉴 관리. 메뉴 CRUD, 카테고리 CRUD, S3 이미지 업로드, 노출 순서 조정 |
| `/admin/history` | AdminOrderHistoryPage | ADMIN | 과거 주문 이력. 테이블/날짜 필터, 페이지네이션 |

## Default

| Path | 동작 |
|---|---|
| `/` | → `/customer/menu`로 리다이렉트 (미인증 시 → `/customer/setup`) |

---

## 인증 가드

| Guard | 조건 | 미인증 시 |
|---|---|---|
| CustomerAuthGuard | `role === 'TABLE'` & `isAuthenticated` | → `/customer/setup` |
| AdminAuthGuard | `role === 'ADMIN'` & `isAuthenticated` | → `/admin/login` |

---

## 레이아웃

| Layout | 적용 경로 | 구성 |
|---|---|---|
| CustomerLayout | `/customer/*` (setup 제외) | 상단 헤더(매장명, 테이블번호, 메뉴/주문내역 탭) + 하단 장바구니 플로팅 버튼 |
| AdminLayout | `/admin/*` (login 제외) | 상단 네비게이션(대시보드/테이블/메뉴/이력 + 로그아웃) + ReLoginModal(세션 만료 시) |

---

## 모달 (별도 라우트 없음)

| Modal | 트리거 | 설명 |
|---|---|---|
| MenuDetailModal | MenuPage에서 메뉴 카드 클릭 | 메뉴 상세 + 수량 선택 + 담기 |
| RecommendationModal | MenuPage 진입 1분 후 자동 | 성별/나이대 선택 → 인기 메뉴 추천 |
| DemographicModal | 주문 완료 후 (FE-5) | 성별/나이대 설문 수집 |
| RatingModal | 주문 완료 후 (FE-5) | 메뉴별 별점 평가 (1~5점) |
| TableDetailModal | DashboardPage에서 테이블 카드 클릭 | 주문 상세, 상태 변경, 삭제 |
| ReLoginModal | 관리자 JWT 만료 시 (401) | 재로그인 또는 로그아웃 |
| ConfirmDialog | 이용 완료, 메뉴 삭제 등 | 확인/취소 팝업 |
