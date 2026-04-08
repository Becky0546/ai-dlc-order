# Services

서비스 레이어 정의 및 오케스트레이션 패턴.

---

## Service Definitions

### AuthService
**책임**: 인증 및 토큰 관리
- 관리자 로그인: 매장 코드 + 사용자명 + 비밀번호 검증 → JWT 발급
- 테이블 디바이스 로그인: 매장 코드 + 테이블번호 + 비밀번호 검증 → JWT 발급
- 토큰 갱신 및 검증
- bcrypt 패스워드 해싱
- 로그인 시도 제한 (연속 실패 시 잠금)

**의존**: StoreService, TableService, JwtUtil

### StoreService
**책임**: 매장 정보 관리
- 매장 조회

**의존**: StoreRepository

### TableService
**책임**: 테이블 CRUD
- 테이블 등록, 수정, 삭제
- 테이블 목록 및 상세 조회

**의존**: TableRepository

### TableSessionService
**책임**: 테이블 세션 라이프사이클 관리
- 세션 시작: 첫 주문 시 자동 생성
- 세션 종료 (이용 완료): 주문 이력 아카이브 → 테이블 리셋
- 현재 세션 정보 조회

**의존**: TableRepository, TableSessionRepository, OrderService (이력 아카이브)

**오케스트레이션 — 세션 종료 플로우**:
1. 현재 세션의 모든 주문을 OrderHistory로 이동 (OrderService.archiveSessionOrders)
2. 테이블 현재 주문 목록 및 총 주문액 리셋
3. 세션 상태를 ENDED로 변경
4. SSE 이벤트 브로드캐스트 (SseService)

### MenuService
**책임**: 메뉴 및 카테고리 관리
- 메뉴 CRUD (등록/수정/삭제)
- 카테고리 CRUD
- 메뉴 노출 순서 조정
- 필수 필드 및 가격 범위 검증

**의존**: MenuRepository, CategoryRepository, ImageService

### ImageService
**책임**: S3 이미지 관리
- 이미지 업로드 (최대 2MB, S3)
- 이미지 삭제
- S3 URL 반환

**의존**: AWS S3 Client

### OrderService
**책임**: 주문 생성, 조회, 삭제, 상태 관리
- 주문 생성: 장바구니 아이템 검증 → 주문 저장 → SSE 알림
- 주문 조회: 현재 세션 기준 필터링
- 주문 삭제 (관리자): 주문 제거 → 총 주문액 재계산 → SSE 알림
- 주문 상태 변경: 대기중 → 준비중 → 완료 → SSE 알림
- 대시보드 데이터 집계 (테이블별 주문 현황)
- 주문 이력 아카이브 (세션 종료 시)

**의존**: OrderRepository, OrderHistoryRepository, MenuService, TableSessionService, SseService

**오케스트레이션 — 주문 생성 플로우**:
1. 테이블/세션 유효성 확인
2. 메뉴 아이템 존재 여부 및 가격 검증 (MenuService)
3. 세션이 없으면 자동 시작 (TableSessionService.startSession)
4. 주문 저장 (OrderRepository)
5. SSE 이벤트 브로드캐스트 — NEW_ORDER (SseService)
6. OrderResponse 반환

### RecommendationService
**책임**: 인구통계 기반 메뉴 추천
- 인구통계 데이터 저장 (주문 ID + 성별 + 나이대)
- 추천 메뉴 조회: 동일 성별/나이대 주문 데이터 집계 → 인기순 정렬
- 데이터 부족 시 전체 인기 메뉴 폴백

**의존**: DemographicOrderRepository, OrderRepository, MenuRepository

### RatingService
**책임**: 메뉴별 별점 관리
- 별점 등록 (주문 완료 후, 1~5점)
- 메뉴별 평균 별점 계산
- 전체 메뉴 별점 목록 조회

**의존**: RatingRepository, OrderRepository

### SseService
**책임**: 실시간 이벤트 스트리밍
- SSE 구독 관리 (SseEmitter 생성 및 저장)
- 이벤트 브로드캐스트 (모든 구독자에게 전송)
- 연결 타임아웃 처리 및 정리
- 이벤트 타입: NEW_ORDER, ORDER_STATUS_CHANGED, ORDER_DELETED

**의존**: 없음 (다른 서비스에서 호출됨)

---

## Service Interaction Summary

```
OrderService ──> MenuService          (메뉴/가격 검증)
OrderService ──> TableSessionService  (세션 확인/자동 시작)
OrderService ──> SseService           (NEW_ORDER, STATUS_CHANGED, DELETED 이벤트)
TableSessionService ──> OrderService  (이력 아카이브)
TableSessionService ──> SseService    (세션 종료 이벤트)
MenuService ──> ImageService          (S3 이미지 업로드/삭제)
AuthService ──> StoreService          (매장 검증)
AuthService ──> TableService          (테이블 검증)
RecommendationService ──> OrderRepository  (주문 데이터 집계)
RatingService ──> OrderRepository     (주문 존재 확인)
```
