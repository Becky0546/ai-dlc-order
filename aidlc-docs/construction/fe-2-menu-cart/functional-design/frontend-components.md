# FE-2 Frontend Components

## 1. MenuPage
**라우트**: `/customer/menu`
- 상단 카테고리 탭 바 (가로 스크롤)
- 선택 카테고리 메뉴 그리드 (2열)
- MenuCard 클릭 → MenuDetailModal

## 2. MenuCard
- 이미지 (S3 URL), 메뉴명, 가격, 평균 별점 (StarRating)
- 터치 영역 44x44px 이상
- 클릭 → MenuDetailModal 오픈

## 3. MenuDetailModal
- 메뉴 이미지 (큰 사이즈), 이름, 가격, 설명, 별점
- 수량 선택: [-] 숫자 [+] (최소 1)
- "담기" 버튼 → 장바구니 추가 후 모달 닫기
- 배경 클릭/X 버튼으로 닫기

## 4. StarRating (표시 전용)
- props: score (0~5), size ('sm'|'md')
- 별 5개 중 score만큼 채움 (소수점 반올림)

## 5. CartPage
**라우트**: `/customer/cart`
- 장바구니 아이템 리스트 (이미지, 이름, 단가, 수량 조절, 소계, 삭제)
- 하단 고정: 총 금액 + "주문하기" 버튼
- 빈 장바구니 시 "장바구니가 비어있습니다" + 메뉴 이동 링크

## 6. useCartStore (Zustand + localStorage)
```typescript
interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  updateQuantity: (menuId: number, quantity: number) => void;
  removeItem: (menuId: number) => void;
  clear: () => void;
  totalAmount: number;
  totalCount: number;
}
```
