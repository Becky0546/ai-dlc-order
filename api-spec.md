# API Specification

프론트엔드에서 사용하는 전체 API 명세. Base URL: `/api/v1`

인증: `Authorization: Bearer {JWT token}` (로그인 API 제외)

---

## 1. Authentication (인증)

### POST /api/v1/auth/admin/login
관리자 로그인

**Request Body:**
```json
{
  "storeCode": "string",
  "username": "string",
  "password": "string"
}
```

**Response 200:**
```json
{
  "token": "string (JWT)",
  "expiresAt": "string (ISO 8601)",
  "storeName": "string"
}
```

**Error:** 401 인증 실패, 423 로그인 시도 제한 초과

---

### POST /api/v1/auth/table/login
테이블 디바이스 로그인

**Request Body:**
```json
{
  "storeCode": "string",
  "tableNumber": 1,
  "tablePassword": "string"
}
```

**Response 200:**
```json
{
  "token": "string (JWT)",
  "storeId": 1,
  "tableId": 1,
  "tableName": "string",
  "sessionId": 1
}
```
> `sessionId`는 활성 세션이 없으면 `null`

**Error:** 401 인증 실패

---

### POST /api/v1/auth/refresh
토큰 갱신

**Request Header:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "token": "string (JWT)",
  "expiresAt": "string (ISO 8601)",
  "storeName": "string"
}
```

---

## 2. Categories (카테고리)

### GET /api/v1/categories
카테고리 목록 조회

**Response 200:**
```json
[
  {
    "id": 1,
    "name": "string",
    "displayOrder": 0
  }
]
```

---

### POST /api/v1/categories
카테고리 등록

**Request Body:**
```json
{
  "name": "string",
  "displayOrder": 0
}
```

**Response 201:**
```json
{
  "id": 1,
  "name": "string",
  "displayOrder": 0
}
```

---

### PUT /api/v1/categories/{categoryId}
카테고리 수정

**Request Body:**
```json
{
  "name": "string",
  "displayOrder": 0
}
```

**Response 200:** Category 객체 (동일 구조)

---

### DELETE /api/v1/categories/{categoryId}
카테고리 삭제

**Response:** 204 No Content

---

## 3. Menus (메뉴)

### GET /api/v1/menus
메뉴 목록 조회

**Query Params:** `categoryId` (optional, number)

**Response 200:**
```json
[
  {
    "id": 1,
    "name": "string",
    "price": 10000,
    "description": "string",
    "imageUrl": "string (S3 URL)",
    "categoryId": 1,
    "categoryName": "string",
    "displayOrder": 0,
    "averageRating": 4.5
  }
]
```

---

### POST /api/v1/menus
메뉴 등록

**Request Body:**
```json
{
  "name": "string",
  "price": 10000,
  "description": "string",
  "categoryId": 1,
  "displayOrder": 0
}
```

**Response 201:** Menu 객체 (GET 응답과 동일 구조)

---

### PUT /api/v1/menus/{menuId}
메뉴 수정

**Request Body:** MenuCreateRequest와 동일

**Response 200:** Menu 객체

---

### DELETE /api/v1/menus/{menuId}
메뉴 삭제

**Response:** 204 No Content

---

### PUT /api/v1/menus/order
메뉴 노출 순서 변경

**Request Body:**
```json
[
  { "menuId": 1, "displayOrder": 0 },
  { "menuId": 2, "displayOrder": 1 }
]
```

**Response:** 204 No Content

---

### POST /api/v1/menus/{menuId}/image
메뉴 이미지 업로드 (최대 2MB)

**Request:** `Content-Type: multipart/form-data`, field name: `file`

**Response 200:**
```json
{
  "imageUrl": "string (S3 URL)"
}
```

---

## 4. Tables (테이블)

### GET /api/v1/tables
테이블 목록 조회

**Response 200:**
```json
[
  {
    "id": 1,
    "number": 1,
    "name": "string",
    "password": "string",
    "currentSessionId": 1,
    "sessionStatus": "ACTIVE"
  }
]
```
> `currentSessionId`는 세션 없으면 `null`, `sessionStatus`는 `"ACTIVE"` | `"ENDED"` | `null`

---

### POST /api/v1/tables
테이블 등록

**Request Body:**
```json
{
  "number": 1,
  "name": "string",
  "password": "string"
}
```

**Response 201:** TableResponse 객체

---

### PUT /api/v1/tables/{tableId}
테이블 수정

**Request Body:**
```json
{
  "name": "string",
  "password": "string"
}
```

**Response 200:** TableResponse 객체

---

### POST /api/v1/tables/{tableId}/sessions/end
테이블 이용 완료 (세션 종료)

현재 세션의 주문을 이력으로 이동하고 테이블을 리셋합니다.

**Response 200:**
```json
{
  "archivedOrderCount": 5,
  "totalAmount": 50000
}
```

---

## 5. Orders (주문)

### POST /api/v1/orders
주문 생성

**Request Body:**
```json
{
  "tableId": 1,
  "sessionId": 1,
  "items": [
    { "menuId": 1, "quantity": 2 },
    { "menuId": 3, "quantity": 1 }
  ]
}
```

**Response 201:**
```json
{
  "orderId": 1,
  "orderNumber": "ORD-20260408-001",
  "items": [
    {
      "menuId": 1,
      "menuName": "string",
      "quantity": 2,
      "unitPrice": 10000
    }
  ],
  "totalAmount": 30000,
  "status": "PENDING",
  "createdAt": "string (ISO 8601)"
}
```

---

### GET /api/v1/orders
주문 조회 (현재 세션)

**Query Params:** `tableId` (required), `sessionId` (optional)

**Response 200:** `OrderResponse[]` (위 구조의 배열)

---

### GET /api/v1/orders/{orderId}
주문 상세 조회

**Response 200:** OrderResponse 객체

---

### PATCH /api/v1/orders/{orderId}/status
주문 상태 변경 (관리자)

**Request Body:**
```json
{
  "status": "PENDING | PREPARING | COMPLETED"
}
```

**Response 200:** OrderResponse 객체 (상태 업데이트됨)

---

### DELETE /api/v1/orders/{orderId}
주문 삭제 (관리자 직권)

**Response:** 204 No Content

---

### GET /api/v1/orders/history
과거 주문 이력 조회

**Query Params:** `tableId` (required), `date` (optional, YYYY-MM-DD), `page` (default 0), `size` (default 20)

**Response 200:**
```json
{
  "content": [
    {
      "orderId": 1,
      "orderNumber": "ORD-20260408-001",
      "items": [
        { "menuName": "string", "quantity": 2, "unitPrice": 10000 }
      ],
      "totalAmount": 30000,
      "completedAt": "string (ISO 8601)"
    }
  ],
  "totalPages": 5,
  "totalElements": 100,
  "number": 0
}
```

---

### GET /api/v1/orders/dashboard
관리자 대시보드 (테이블별 주문 현황)

**Response 200:**
```json
[
  {
    "tableId": 1,
    "tableNumber": 1,
    "totalAmount": 50000,
    "recentOrders": [
      {
        "orderId": 1,
        "orderNumber": "ORD-20260408-001",
        "menuSummary": "김치찌개 x2, 된장찌개 x1",
        "totalAmount": 30000,
        "status": "PENDING",
        "createdAt": "string (ISO 8601)"
      }
    ],
    "hasNewOrder": true
  }
]
```

---

## 6. Ratings (평가)

### POST /api/v1/ratings
메뉴별 별점 등록 (주문 완료 후)

**Request Body:**
```json
{
  "orderId": 1,
  "ratings": [
    { "menuId": 1, "score": 5 },
    { "menuId": 3, "score": 4 }
  ]
}
```
> `score`: 1~5 정수

**Response:** 201 Created

---

### GET /api/v1/ratings/menus
전체 메뉴 평균 별점 목록

**Response 200:**
```json
[
  {
    "menuId": 1,
    "averageScore": 4.5,
    "totalCount": 20
  }
]
```

---

## 7. Recommendations (추천)

### POST /api/v1/recommendations/demographic
인구통계 데이터 저장 (주문 완료 후)

**Request Body:**
```json
{
  "orderId": 1,
  "gender": "MALE | FEMALE",
  "ageGroup": "TEENS | TWENTIES | THIRTIES | FORTIES | FIFTIES_PLUS"
}
```

**Response:** 201 Created

---

### GET /api/v1/recommendations
추천 메뉴 조회

**Query Params:** `gender` (required), `ageGroup` (required)

**Response 200:**
```json
{
  "gender": "MALE",
  "ageGroup": "TWENTIES",
  "recommendedMenus": [
    {
      "menuId": 1,
      "menuName": "string",
      "imageUrl": "string (S3 URL)",
      "orderCount": 50,
      "averageRating": 4.5
    }
  ]
}
```

---

## 8. SSE (Server-Sent Events)

### GET /api/v1/sse/orders
관리자 실시간 주문 이벤트 스트림

**Protocol:** Server-Sent Events (EventSource)

**Event Types:**
| 이벤트 | 발생 시점 |
|---|---|
| `NEW_ORDER` | 새 주문 생성 시 |
| `ORDER_STATUS_CHANGED` | 주문 상태 변경 시 |
| `ORDER_DELETED` | 주문 삭제 시 |

**요구사항:** 2초 이내 이벤트 전달

---

## Summary

| 영역 | 엔드포인트 수 |
|---|---|
| Authentication | 3 |
| Categories | 4 |
| Menus | 6 |
| Tables | 4 |
| Orders | 6 |
| Ratings | 2 |
| Recommendations | 2 |
| SSE | 1 |
| **합계** | **28** |
