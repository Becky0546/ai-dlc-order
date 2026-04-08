# Component Dependencies

## Dependency Matrix

```
                 auth  store  table  menu  order  recommendation  rating  sse  common
auth              -     R      R      -     -         -            -      -     R
store             -     -      -      -     -         -            -      -     R
table             -     -      -      -     R*        -            -      R     R
menu              -     -      -      -     -         -            -      -     R
order             -     -      R      R     -         -            -      R     R
recommendation    -     -      -      R*    R*        -            -      -     R
rating            -     -      -      -     R*        -            -      -     R
sse               -     -      -      -     -         -            -      -     R
common            -     -      -      -     -         -            -      -     -

R  = 직접 의존 (서비스 호출)
R* = 읽기 전용 의존 (Repository 직접 참조)
```

## Communication Patterns

### 동기 통신 (Service → Service)
모든 서비스 간 통신은 동기 메서드 호출. 단일 JVM 내 Spring DI 기반.

```
+-------+     +----------+     +--------+
| Order |---->| Menu     |     | Image  |
|Service|     | Service  |---->| Service|---> [S3]
+-------+     +----------+     +--------+
    |
    |-------->+----------+
    |         | Table    |
    |         | Session  |
    |         | Service  |
    |         +----------+
    |              |
    |              +--------> OrderService.archiveSessionOrders()
    |
    +-------->+---------+
              |   SSE   |========> [Admin Browser]
              | Service |  (Server-Sent Events)
              +---------+
```

### 비동기 통신 (SSE)
관리자 브라우저와의 실시간 통신은 SSE(SseEmitter) 사용.

**이벤트 흐름:**
```
[Customer Action]
       |
       v
  OrderService
       |
       +--- createOrder() ---> SseService.broadcast(NEW_ORDER, orderData)
       +--- updateStatus() --> SseService.broadcast(ORDER_STATUS_CHANGED, orderData)
       +--- deleteOrder() ---> SseService.broadcast(ORDER_DELETED, orderId)
       |
       v
  SseService ====SSE====> AdminBrowser (EventSource)
```

## Data Flow

### 1. 고객 주문 플로우
```
[Customer Browser]
       |
  POST /api/v1/orders
       |
       v
  OrderController
       |
       v
  OrderService
       |--- validateSession() --> TableSessionService
       |--- validateMenuItems() --> MenuService  
       |--- saveOrder() --> OrderRepository --> [MySQL]
       |--- broadcast(NEW_ORDER) --> SseService --> [Admin Browser]
       |
       v
  OrderResponse --> [Customer Browser]
```

### 2. 주문 완료 후 데이터 수집 플로우
```
[Customer Browser] -- 주문 성공 후
       |
       +--- POST /api/v1/recommendations/demographic
       |         |
       |         v
       |    RecommendationService --> DemographicOrderRepository --> [MySQL]
       |
       +--- POST /api/v1/ratings
                 |
                 v
            RatingService --> RatingRepository --> [MySQL]
```

### 3. 메뉴 추천 플로우
```
[Customer Browser] -- 메뉴 화면 진입 1분 후
       |
  GET /api/v1/recommendations?gender=MALE&ageGroup=TWENTIES
       |
       v
  RecommendationService
       |--- queryByDemographic() --> DemographicOrderRepository
       |--- aggregatePopularMenus() --> (데이터 집계)
       |--- fallbackToOverallPopular() --> (데이터 부족 시)
       |
       v
  RecommendationResponse --> [Customer Browser Modal]
```

### 4. 관리자 실시간 모니터링 플로우
```
[Admin Browser]
       |
  GET /api/v1/sse/orders (EventSource 연결)
       |
       v
  SseController --> SseService.subscribe() --> SseEmitter 반환
       |
       v
  [SSE 연결 유지] <==== broadcast events
       |
  GET /api/v1/orders/dashboard (초기 데이터 로드)
       |
       v
  OrderService.getDashboard() --> [테이블별 주문 현황]
```

### 5. 세션 종료 (이용 완료) 플로우
```
[Admin Browser]
       |
  POST /api/v1/tables/{tableId}/sessions/end
       |
       v
  TableSessionService
       |--- archiveOrders() --> OrderService.archiveSessionOrders()
       |         |--- 현재 주문 -> OrderHistory 이동
       |         |--- 현재 주문 삭제
       |--- resetTable() --> 총 주문액 0, 주문 목록 클리어
       |--- endSession() --> 세션 상태 ENDED
       |--- broadcast() --> SseService (세션 종료 이벤트)
       |
       v
  SessionEndResponse --> [Admin Browser]
```

## Circular Dependency Prevention

**잠재적 순환 의존**: OrderService <-> TableSessionService
- OrderService는 세션 확인을 위해 TableSessionService에 의존
- TableSessionService는 이력 아카이브를 위해 OrderService에 의존

**해결 방안**: 
- TableSessionService가 OrderService.archiveSessionOrders()를 호출하는 대신, OrderRepository를 직접 사용하여 이력 아카이브 수행
- 또는 이벤트 패턴: 세션 종료 이벤트 발행 → OrderService가 리스너로 이력 아카이브 처리
