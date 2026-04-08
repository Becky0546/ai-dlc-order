# FE-3 Frontend Components

## 1. OrderSuccessPage (/customer/order-success)
- 주문 번호 표시, 5초 카운트다운 후 /customer/menu 자동 리다이렉트
- query params: orderId, orderNumber
- 주문 완료 후 DemographicModal + RatingModal 트리거 (FE-5에서 구현)

## 2. OrderHistoryPage (/customer/orders)
- 현재 세션 주문 목록 (시간 역순)
- OrderCard로 각 주문 표시
- 페이지네이션 또는 무한 스크롤

## 3. DashboardPage (/admin/dashboard)
- SSE 연결로 실시간 주문 수신
- 테이블별 그리드 레이아웃 (TableCard)
- 신규 주문 시각적 강조 (색상 변경)

## 4. TableDetailModal
- TableCard 클릭 시 표시
- 해당 테이블 전체 주문 목록
- 주문 상태 변경 (대기중/준비중/완료)
- 주문 삭제 (확인 팝업)

## 5. OrderCard
- 주문 번호, 시각, 메뉴 목록(축약), 총 금액

## 6. TableCard
- 테이블 번호, 총 주문액, 최신 주문 미리보기, 신규 주문 하이라이트

## 7. useSSE (Custom Hook)
- EventSource 연결 (/api/v1/sse/orders)
- 이벤트: NEW_ORDER, ORDER_STATUS_CHANGED, ORDER_DELETED
- React Query 캐시 무효화로 자동 갱신
