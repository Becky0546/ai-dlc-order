# FE-1 Business Logic Model

## 1. 관리자 로그인 플로우

```
AdminLoginPage
  |
  1. 사용자 입력: storeCode, username, password
  2. 클라이언트 유효성 검증
  3. POST /api/v1/auth/admin/login
  |
  +-- 성공:
  |     - useAuthStore에 token, expiresAt, role='ADMIN' 저장
  |     - localStorage에 token 저장 (새로고침 유지)
  |     - /admin/dashboard로 리다이렉트
  |
  +-- 실패:
        - 401: "아이디 또는 비밀번호가 올바르지 않습니다"
        - 423: "로그인 시도 제한 초과. 잠시 후 다시 시도해주세요"
        - 네트워크 에러: "서버에 연결할 수 없습니다"
```

## 2. 테이블 디바이스 자동 로그인 플로우

```
앱 진입
  |
  1. localStorage에서 저장된 테이블 인증 정보 확인
  |
  +-- 정보 있음:
  |     - POST /api/v1/auth/table/login (저장된 정보로 자동 요청)
  |     |
  |     +-- 성공:
  |     |     - useAuthStore에 token, role='TABLE' 저장
  |     |     - useTableStore에 storeId, tableId, tableName, sessionId 저장
  |     |     - /customer/menu로 리다이렉트
  |     |
  |     +-- 실패 (비밀번호 변경 등):
  |           - localStorage 인증 정보 삭제
  |           - TableSetupPage 표시
  |
  +-- 정보 없음:
        - TableSetupPage 표시 (/customer/setup)
```

## 3. 테이블 초기 설정 플로우

```
TableSetupPage
  |
  1. 사용자 입력: storeCode, tableNumber, tablePassword
  2. 클라이언트 유효성 검증
  3. POST /api/v1/auth/table/login
  |
  +-- 성공:
  |     - localStorage에 { storeCode, tableNumber, tablePassword } 저장
  |     - useAuthStore, useTableStore 업데이트
  |     - /customer/menu로 리다이렉트
  |
  +-- 실패:
        - 401: "매장 정보 또는 테이블 비밀번호가 올바르지 않습니다"
```

## 4. JWT 토큰 관리

```
Axios Interceptor
  |
  요청 시:
  - useAuthStore에서 token 읽기
  - Authorization: Bearer {token} 헤더 추가
  |
  응답 시 (401 에러):
  |
  +-- role === 'ADMIN':
  |     - 재로그인 모달 표시 (ReLoginModal)
  |     - 모달에서 로그인 성공 → 원래 요청 재시도
  |     - 모달에서 취소 → useAuthStore 초기화
  |
  +-- role === 'TABLE':
        - 자동 재로그인 시도 (localStorage 정보)
        - 실패 시 TableSetupPage로 리다이렉트
```

## 5. 라우트 가드

```
Route Protection
  |
  /admin/* 경로:
  - useAuthStore.isAuthenticated && role === 'ADMIN' 확인
  - 미인증 → /admin/login 리다이렉트
  |
  /customer/* 경로 (setup 제외):
  - useAuthStore.isAuthenticated && role === 'TABLE' 확인
  - 미인증 → /customer/setup 리다이렉트
  |
  /customer/setup:
  - 이미 인증됨 → /customer/menu 리다이렉트
  - 미인증 → 그대로 표시
```

## 6. 앱 초기화 (App.tsx)

```
App Mount
  |
  1. localStorage에서 token, role 읽기
  2. token 존재 시 useAuthStore 복원
  3. role === 'TABLE' → 테이블 자동 로그인 시도
  4. role === 'ADMIN' → token 유효성 확인 (refresh 시도)
  5. React Router 렌더링 (라우트 가드 적용)
```
