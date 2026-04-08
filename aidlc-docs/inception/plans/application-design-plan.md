# Application Design Plan

테이블오더 서비스의 컴포넌트, 서비스 레이어, 의존성을 설계합니다.

---

## Design Plan

### Part 1: Component Identification
- [x] 백엔드 컴포넌트 식별 및 책임 정의
- [x] 프론트엔드 컴포넌트 식별 및 책임 정의
- [x] 컴포넌트 인터페이스 정의

### Part 2: Component Methods
- [x] 각 백엔드 컴포넌트의 메서드 시그니처 정의
- [x] 입출력 타입 정의

### Part 3: Service Layer Design
- [x] 서비스 정의 및 오케스트레이션 패턴
- [x] 서비스 간 상호작용 정의

### Part 4: Component Dependencies
- [x] 의존성 관계 매트릭스
- [x] 통신 패턴 및 데이터 흐름

### Part 5: Validation
- [x] 설계 완전성 및 일관성 검증

---

## Design Questions

아래 질문에 답변해주세요. [Answer]: 태그 뒤에 선택지를 기입해주세요.

## Question 1
Spring Boot 백엔드 패키지 구조는 어떤 방식을 선호하시나요?

A) 레이어 기반 — controller/, service/, repository/, entity/, dto/ 로 분리
B) 기능(도메인) 기반 — order/, menu/, table/, recommendation/, rating/ 도메인별 패키지
C) 혼합 — 도메인별 패키지 내에서 레이어 분리 (예: order/controller/, order/service/)
X) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 2
React 프론트엔드 상태 관리는 어떤 방식을 선호하시나요?

A) React Context API + useReducer (외부 라이브러리 없이)
B) Redux Toolkit
C) Zustand (경량 상태 관리)
D) React Query (TanStack Query) — 서버 상태 중심
X) Other (please describe after [Answer]: tag below)

[Answer]: C, D 혼합 (전역 상태 필요는 C, api 호출은 D)

## Question 3
SSE(Server-Sent Events) 구현 방식은 어떤 것을 선호하시나요?

A) Spring MVC SseEmitter (전통적 방식, 동기 스레드 모델)
B) Spring WebFlux (리액티브 방식, 비동기 논블로킹)
X) Other (please describe after [Answer]: tag below)

[Answer]: B 구현 시 너무 복잡해지지 않을 것 같다면 b로 하고 아니면 a

## Question 4
메뉴 이미지 업로드 시 파일 크기 제한은 어떻게 하시겠습니까?

A) 최대 2MB
B) 최대 5MB
C) 최대 10MB
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 5
API 버저닝 전략은 어떤 방식을 선호하시나요?

A) URL 경로 기반 (예: /api/v1/orders)
B) 버저닝 없음 — MVP 단계이므로 단일 버전
X) Other (please describe after [Answer]: tag below)

[Answer]: A
