# FE-1 Business Rules

## 1. 입력 유효성 검증

### 관리자 로그인 (AdminLoginPage)
| 필드 | 규칙 |
|---|---|
| storeCode | 필수, 공백 불가 |
| username | 필수, 공백 불가 |
| password | 필수, 최소 1자 |

### 테이블 초기 설정 (TableSetupPage)
| 필드 | 규칙 |
|---|---|
| storeCode | 필수, 공백 불가 |
| tableNumber | 필수, 양의 정수 |
| tablePassword | 필수, 최소 1자 |

## 2. JWT 토큰 규칙

| 규칙 | 설명 |
|---|---|
| 저장 위치 | localStorage (`auth_token`, `auth_role`) |
| 만료 시간 | 서버에서 지정 (16시간), `expiresAt` 필드 |
| 갱신 | 관리자: 401 응답 시 재로그인 모달 / 테이블: 자동 재로그인 |
| 삭제 | 로그아웃 시, 인증 실패 시 |

## 3. 자동 로그인 규칙

| 규칙 | 설명 |
|---|---|
| 테이블 디바이스 | localStorage에 `table_credentials` 존재 시 자동 로그인 시도 |
| 자동 로그인 실패 | 저장된 credentials 삭제 → TableSetupPage 표시 |
| 관리자 | 새로고침 시 localStorage token으로 세션 복원 |

## 4. 라우트 보호 규칙

| 경로 패턴 | 접근 조건 | 미인증 시 |
|---|---|---|
| `/admin/login` | 누구나 | — |
| `/admin/*` | role === 'ADMIN' & isAuthenticated | → `/admin/login` |
| `/customer/setup` | 누구나 (인증됨이면 메뉴로) | — |
| `/customer/*` | role === 'TABLE' & isAuthenticated | → `/customer/setup` |

## 5. 관리자 토큰 만료 처리

| 상황 | 동작 |
|---|---|
| API 401 응답 | ReLoginModal 표시 (현재 페이지 유지) |
| 모달에서 로그인 성공 | 새 토큰 저장, 실패한 요청 자동 재시도 |
| 모달에서 취소 | 토큰 삭제, `/admin/login` 리다이렉트 |

## 6. localStorage 키 목록

| 키 | 타입 | 용도 |
|---|---|---|
| `auth_token` | string | JWT 토큰 |
| `auth_role` | 'ADMIN' \| 'TABLE' | 사용자 역할 |
| `auth_expires_at` | string (ISO) | 토큰 만료 시각 |
| `table_credentials` | JSON | `{ storeCode, tableNumber, tablePassword }` |
| `table_info` | JSON | `{ storeId, tableId, tableName, sessionId }` |
| `cart_items` | JSON | 장바구니 (FE-2에서 사용) |
