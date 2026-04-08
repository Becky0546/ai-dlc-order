# FE-1 Functional Design Plan

**Unit**: FE-1 (프로젝트 설정 + 인증)
**범위**: Vite/Tailwind 초기 설정, 라우팅, Axios/JWT, useAuthStore, useTableStore, Layout, TableSetupPage, AdminLoginPage

---

## Plan

- [x] TypeScript 타입 정의 (Auth, Table, Store)
- [x] 비즈니스 로직 설계 (인증 플로우, JWT 관리, 자동 로그인)
- [x] 비즈니스 규칙 정의 (유효성 검증, 라우트 가드, 토큰 만료)
- [x] 프론트엔드 컴포넌트 상세 설계 (페이지, 레이아웃, 상태 관리)

---

## Questions

## Question 1
고객용 화면 하단/상단 네비게이션 구성은 어떻게 하시겠습니까?

A) 하단 탭 바 — 메뉴 | 장바구니 | 주문내역 (모바일 스타일)
B) 상단 헤더 바 — 로고 + 메뉴/장바구니/주문내역 링크
C) 상단 헤더 + 하단 장바구니 플로팅 버튼
X) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 2
관리자 JWT 토큰이 만료(16시간)되었을 때 동작은?

A) 자동으로 로그인 페이지 리다이렉트 + "세션이 만료되었습니다" 토스트 메시지
B) 현재 페이지에서 모달로 재로그인 요청
X) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 3
테이블 디바이스 초기 설정 화면은 언제 노출되나요?

A) 저장된 인증 정보가 없을 때만 자동 표시 (있으면 바로 메뉴 화면)
B) 항상 `/customer/setup` 경로로 수동 접근 가능 + 저장 정보 없으면 자동 리다이렉트
X) Other (please describe after [Answer]: tag below)

[Answer]: A
