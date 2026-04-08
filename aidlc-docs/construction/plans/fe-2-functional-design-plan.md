# FE-2 Functional Design Plan

**Unit**: FE-2 (메뉴 + 장바구니)
**범위**: MenuPage, CartPage, MenuCard, StarRating, useCartStore, useMenus, useCategories
**기능 요구사항**: FR-C02 (메뉴 조회), FR-C03 (장바구니 관리)

---

## Plan

- [ ] TypeScript 타입 정의 (Menu, Category, Cart)
- [ ] 비즈니스 로직 설계 (메뉴 탐색, 장바구니 CRUD, 주문 확정 연동)
- [ ] 비즈니스 규칙 정의 (수량 제한, 금액 계산, localStorage 동기화)
- [ ] 프론트엔드 컴포넌트 상세 설계

---

## Questions

## Question 1
메뉴 카드에서 장바구니 추가 방식은?

A) 메뉴 카드에 바로 [+] 버튼 → 1개씩 추가 (탭 한 번으로 담기)
B) 메뉴 카드 클릭 → 상세 모달 → 수량 선택 후 "담기" 버튼
C) A+B 혼합 — 카드에 [+] 버튼 + 카드 클릭 시 상세 모달 (설명/이미지 확대)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 2
장바구니에서 "주문하기" 버튼 클릭 시 동작은?

A) 바로 주문 API 호출 (CartPage에서 직접 주문 생성)
B) 주문 확인 화면으로 이동 후 "주문 확정" 버튼
X) Other (please describe after [Answer]: tag below)

[Answer]: A
