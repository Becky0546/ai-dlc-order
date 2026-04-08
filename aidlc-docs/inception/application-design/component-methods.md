# Component Methods

메서드 시그니처 및 입출력 타입 정의.
상세 비즈니스 규칙은 Functional Design에서 정의합니다.

---

## 1. auth

### AuthController
```java
POST /api/v1/auth/admin/login
  Input:  AdminLoginRequest { storeCode, username, password }
  Output: LoginResponse { token, expiresAt, storeName }

POST /api/v1/auth/table/login
  Input:  TableLoginRequest { storeCode, tableNumber, tablePassword }
  Output: TableLoginResponse { token, storeId, tableId, tableName, sessionId }

POST /api/v1/auth/refresh
  Input:  Header(Authorization: Bearer {token})
  Output: LoginResponse { token, expiresAt }
```

### AuthService
```java
LoginResponse loginAdmin(AdminLoginRequest request)
TableLoginResponse loginTable(TableLoginRequest request)
LoginResponse refreshToken(String token)
void validateToken(String token)
```

---

## 2. store

### StoreController
```java
GET /api/v1/stores/{storeId}
  Output: StoreResponse { id, name, code, address }
```

### StoreService
```java
StoreResponse getStore(Long storeId)
```

---

## 3. table

### TableController
```java
GET /api/v1/tables
  Output: List<TableResponse> { id, number, name, password, currentSessionId, sessionStatus }

POST /api/v1/tables
  Input:  TableCreateRequest { number, name, password }
  Output: TableResponse

PUT /api/v1/tables/{tableId}
  Input:  TableUpdateRequest { name, password }
  Output: TableResponse

POST /api/v1/tables/{tableId}/sessions/end
  Output: SessionEndResponse { archivedOrderCount, totalAmount }

GET /api/v1/tables/{tableId}/session
  Output: SessionResponse { sessionId, startedAt, tableId, totalOrderAmount }
```

### TableService
```java
List<TableResponse> getAllTables()
TableResponse createTable(TableCreateRequest request)
TableResponse updateTable(Long tableId, TableUpdateRequest request)
TableResponse getTable(Long tableId)
```

### TableSessionService
```java
SessionResponse getCurrentSession(Long tableId)
SessionResponse startSession(Long tableId)       // 첫 주문 시 자동
SessionEndResponse endSession(Long tableId)       // 이용 완료
```

---

## 4. menu

### MenuController
```java
GET /api/v1/menus?categoryId={categoryId}
  Output: List<MenuResponse> { id, name, price, description, imageUrl, categoryId, categoryName, displayOrder, averageRating }

GET /api/v1/menus/{menuId}
  Output: MenuResponse

POST /api/v1/menus
  Input:  MenuCreateRequest { name, price, description, categoryId, displayOrder }
  Output: MenuResponse

PUT /api/v1/menus/{menuId}
  Input:  MenuUpdateRequest { name, price, description, categoryId, displayOrder }
  Output: MenuResponse

DELETE /api/v1/menus/{menuId}
  Output: void (204)

PUT /api/v1/menus/order
  Input:  List<MenuOrderRequest> { menuId, displayOrder }
  Output: void (204)

POST /api/v1/menus/{menuId}/image
  Input:  MultipartFile (max 2MB)
  Output: ImageResponse { imageUrl }

GET /api/v1/categories
  Output: List<CategoryResponse> { id, name, displayOrder }

POST /api/v1/categories
  Input:  CategoryCreateRequest { name, displayOrder }
  Output: CategoryResponse

PUT /api/v1/categories/{categoryId}
  Input:  CategoryUpdateRequest { name, displayOrder }
  Output: CategoryResponse

DELETE /api/v1/categories/{categoryId}
  Output: void (204)
```

### MenuService
```java
List<MenuResponse> getMenus(Long categoryId)
MenuResponse getMenu(Long menuId)
MenuResponse createMenu(MenuCreateRequest request)
MenuResponse updateMenu(Long menuId, MenuUpdateRequest request)
void deleteMenu(Long menuId)
void updateMenuOrder(List<MenuOrderRequest> requests)
List<CategoryResponse> getCategories()
CategoryResponse createCategory(CategoryCreateRequest request)
CategoryResponse updateCategory(Long categoryId, CategoryUpdateRequest request)
void deleteCategory(Long categoryId)
```

### ImageService
```java
String uploadImage(MultipartFile file)    // returns S3 URL
void deleteImage(String imageUrl)
```

---

## 5. order

### OrderController
```java
POST /api/v1/orders
  Input:  OrderCreateRequest { tableId, sessionId, items: List<OrderItemRequest> { menuId, quantity } }
  Output: OrderResponse { orderId, orderNumber, items, totalAmount, status, createdAt }

GET /api/v1/orders?tableId={tableId}&sessionId={sessionId}
  Output: PagedResponse<OrderResponse>

GET /api/v1/orders/{orderId}
  Output: OrderResponse

DELETE /api/v1/orders/{orderId}
  Output: void (204)

PATCH /api/v1/orders/{orderId}/status
  Input:  OrderStatusRequest { status: PENDING|PREPARING|COMPLETED }
  Output: OrderResponse

GET /api/v1/orders/history?tableId={tableId}&date={date}
  Output: PagedResponse<OrderHistoryResponse> { orderId, orderNumber, items, totalAmount, completedAt }

GET /api/v1/orders/dashboard
  Output: List<TableDashboardResponse> { tableId, tableNumber, totalAmount, recentOrders: List<OrderSummary>, hasNewOrder }
```

### OrderService
```java
OrderResponse createOrder(OrderCreateRequest request)
PagedResponse<OrderResponse> getOrders(Long tableId, Long sessionId, Pageable pageable)
OrderResponse getOrder(Long orderId)
void deleteOrder(Long orderId)
OrderResponse updateOrderStatus(Long orderId, OrderStatus status)
PagedResponse<OrderHistoryResponse> getOrderHistory(Long tableId, LocalDate date, Pageable pageable)
List<TableDashboardResponse> getDashboard()
void archiveSessionOrders(Long tableId, Long sessionId)   // 세션 종료 시 이력 이동
```

---

## 6. recommendation

### RecommendationController
```java
POST /api/v1/recommendations/demographic
  Input:  DemographicRequest { orderId, gender: MALE|FEMALE, ageGroup: TEENS|TWENTIES|THIRTIES|FORTIES|FIFTIES_PLUS }
  Output: void (201)

GET /api/v1/recommendations?gender={gender}&ageGroup={ageGroup}
  Output: RecommendationResponse { gender, ageGroup, recommendedMenus: List<MenuRecommendation> { menuId, menuName, imageUrl, orderCount, averageRating } }
```

### RecommendationService
```java
void saveDemographic(DemographicRequest request)
RecommendationResponse getRecommendations(Gender gender, AgeGroup ageGroup)
```

---

## 7. rating

### RatingController
```java
POST /api/v1/ratings
  Input:  RatingCreateRequest { orderId, ratings: List<MenuRating> { menuId, score (1-5) } }
  Output: void (201)

GET /api/v1/ratings/menus/{menuId}
  Output: MenuRatingSummary { menuId, averageScore, totalCount }

GET /api/v1/ratings/menus
  Output: List<MenuRatingSummary>
```

### RatingService
```java
void createRatings(RatingCreateRequest request)
MenuRatingSummary getMenuRating(Long menuId)
List<MenuRatingSummary> getAllMenuRatings()
```

---

## 8. sse

### SseController
```java
GET /api/v1/sse/orders
  Output: SseEmitter (text/event-stream)
  Events: NEW_ORDER, ORDER_STATUS_CHANGED, ORDER_DELETED
```

### SseService
```java
SseEmitter subscribe()
void broadcast(SseEventType type, Object data)
void removeEmitter(SseEmitter emitter)
```
