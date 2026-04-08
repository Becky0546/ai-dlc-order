# FE-2 Business Logic Model

## 1. 메뉴 조회 플로우
```
MenuPage 마운트
  |
  1. GET /api/v1/categories → 카테고리 목록 로드
  2. GET /api/v1/menus → 전체 메뉴 로드
  3. GET /api/v1/ratings/menus → 메뉴별 평균 별점 로드
  4. 첫 번째 카테고리 자동 선택
  5. 선택된 카테고리의 메뉴만 필터링하여 그리드 표시
```

## 2. 메뉴 상세 → 장바구니 추가 플로우
```
MenuCard 클릭
  |
  1. MenuDetailModal 표시 (이미지, 이름, 가격, 설명, 별점)
  2. 수량 선택 (기본값 1, +/- 버튼)
  3. "담기" 클릭
  4. useCartStore.addItem(menuId, menuName, price, imageUrl, quantity)
  5. localStorage 자동 동기화
  6. 모달 닫기
  7. CustomerLayout 플로팅 버튼 카운트/금액 자동 업데이트
```

## 3. 장바구니 관리 플로우
```
CartPage
  |
  - 장바구니 아이템 목록 표시 (useCartStore.items)
  - 수량 변경: +/- 버튼 → useCartStore.updateQuantity()
  - 아이템 삭제: X 버튼 → useCartStore.removeItem()
  - 총 금액: useCartStore.totalAmount (자동 계산)
  - 장바구니 비우기: useCartStore.clear()
```

## 4. 주문 생성 플로우 (CartPage에서 직접)
```
CartPage "주문하기" 버튼
  |
  1. useTableStore에서 tableId, sessionId 읽기
  2. useCartStore.items → OrderItemRequest[] 변환
  3. POST /api/v1/orders (OrderCreateRequest)
  |
  +-- 성공:
  |     - useCartStore.clear() (장바구니 비우기)
  |     - /customer/order-success?orderId={id} 리다이렉트
  |
  +-- 실패:
        - 에러 메시지 토스트 표시
        - 장바구니 유지
```
