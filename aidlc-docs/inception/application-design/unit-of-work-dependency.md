# Unit of Work Dependency (Frontend)

## 의존성 매트릭스

```
           FE-1   FE-2   FE-3   FE-4   FE-5
FE-1        -      -      -      -      -
FE-2       DEP     -      -      -      -
FE-3       DEP    DEP     -      -      -
FE-4       DEP     -      -      -      -
FE-5       DEP    DEP    DEP     -      -

DEP = 의존
```

## 의존성 상세

| Unit | 의존 대상 | 이유 |
|---|---|---|
| **FE-2** → FE-1 | Vite/Tailwind 설정, React Router, Axios 인스턴스, useAuthStore, useTableStore, Layout |
| **FE-3** → FE-1 | Axios, JWT 인터셉터, Layout, useAuthStore |
| **FE-3** → FE-2 | MenuCard (주문 상세에서 메뉴 정보 표시), useCartStore (주문 생성 시 장바구니 데이터) |
| **FE-4** → FE-1 | Axios, JWT 인터셉터, AdminLayout, useAuthStore |
| **FE-5** → FE-1 | Axios, Layout |
| **FE-5** → FE-2 | MenuCard (추천 메뉴 표시), StarRating (별점 입력) |
| **FE-5** → FE-3 | 주문 완료 플로우 연동 (OrderSuccessPage에서 DemographicModal/RatingModal 트리거) |

## 구현 순서

```
FE-1 (설정+인증)
  |
  +---> FE-2 (메뉴+장바구니)
  |       |
  |       +---> FE-3 (주문+대시보드)
  |       |       |
  |       |       +---> FE-5 (추천/평가)
  |       |
  +---> FE-4 (관리자 관리)
```

**권장 순서**: FE-1 → FE-2 → FE-3 → FE-4 → FE-5

- FE-1은 모든 유닛의 기반이므로 반드시 먼저 완료
- FE-2, FE-4는 FE-1 완료 후 병렬 가능
- FE-3은 FE-2의 장바구니/메뉴 컴포넌트 필요
- FE-5는 FE-3의 주문 완료 플로우 필요 (마지막)

## 브랜치 매핑

| Unit | 브랜치명 |
|---|---|
| FE-1 | `feature/FE-setup-auth` |
| FE-2 | `feature/FE-menu-cart` |
| FE-3 | `feature/FE-order-dashboard` |
| FE-4 | `feature/FE-admin-management` |
| FE-5 | `feature/FE-recommendation-rating` |
