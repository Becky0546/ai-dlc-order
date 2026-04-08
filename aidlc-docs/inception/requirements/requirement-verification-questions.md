# Requirements Verification Questions

테이블오더 서비스의 요구사항을 분석한 결과, 아래 항목들에 대해 명확화가 필요합니다.
각 질문의 [Answer]: 태그 뒤에 선택지 알파벳을 기입해주세요.

---

## Question 1
백엔드(서버) 기술 스택은 무엇을 사용하시겠습니까?

A) Node.js + Express (JavaScript/TypeScript)
B) Python + FastAPI
C) Java + Spring Boot
D) Go + Gin/Echo
X) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 2
프론트엔드(고객용/관리자용 UI) 기술 스택은 무엇을 사용하시겠습니까?

A) React (JavaScript/TypeScript)
B) Vue.js
C) Next.js (React 기반 SSR)
D) Svelte/SvelteKit
X) Other (please describe after [Answer]: tag below)

[Answer]: A (TypeScript)

## Question 3
데이터베이스는 어떤 것을 사용하시겠습니까?

A) PostgreSQL (관계형)
B) MySQL/MariaDB (관계형)
C) MongoDB (NoSQL Document)
D) SQLite (경량 관계형, 개발/소규모용)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 4
고객용 인터페이스와 관리자용 인터페이스의 배포 구조는 어떻게 하시겠습니까?

A) 단일 웹 앱에서 경로(route)로 분리 (예: /customer, /admin)
B) 별도의 두 개 웹 앱으로 분리 (각각 독립 배포)
C) 고객용은 모바일 웹, 관리자용은 별도 SPA
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 5
배포 환경은 어디를 대상으로 하시겠습니까?

A) AWS (EC2, ECS, Lambda 등)
B) 로컬/온프레미스 서버
C) Docker 컨테이너 기반 (클라우드 미정)
D) 개발 환경에서만 실행 (MVP 검증 단계)
X) Other (please describe after [Answer]: tag below)

[Answer]: A (ECS)

## Question 6
동시 접속자(매장) 규모는 어느 정도로 예상하시나요?

A) 소규모: 1~5개 매장 (테스트/파일럿 단계)
B) 중규모: 5~50개 매장
C) 대규모: 50개 이상 매장
D) 단일 매장 전용 (1개 매장만 사용)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 7
메뉴 이미지 관리는 어떤 방식을 원하시나요?

A) 외부 URL 링크만 사용 (이미지 업로드 기능 없음)
B) 서버에 직접 이미지 업로드 및 저장
C) 클라우드 스토리지 (S3 등) 업로드
X) Other (please describe after [Answer]: tag below)

[Answer]: C


## Question 9
관리자의 매장(store) 관리 범위는 어떻게 되나요?

A) 단일 매장 시스템 — 하나의 서버 인스턴스가 하나의 매장만 서비스
B) 멀티 테넌트 — 하나의 시스템에서 여러 매장을 관리 (매장별 격리)
C) 슈퍼 관리자가 매장을 등록하고, 각 매장 관리자가 자기 매장만 관리
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 10
주문 상태 실시간 업데이트(고객 측)는 MVP에 포함하시겠습니까? (요구사항에 "선택사항"으로 표기됨)

A) 포함 — 고객도 SSE로 주문 상태 실시간 확인 가능
B) 제외 — 고객은 페이지 새로고침으로 상태 확인
C) 간단한 폴링(polling) 방식으로 구현 (예: 30초 간격)
X) Other (please describe after [Answer]: tag below)

[Answer]: 스펙 제거

## Question 11
메뉴 관리(CRUD) 기능은 MVP에 포함하시겠습니까? (요구사항 3.2.4에 정의되어 있으나, MVP 범위 목록에는 명시되지 않음)

A) 포함 — 관리자가 메뉴를 직접 등록/수정/삭제 가능
B) 제외 — DB에 직접 데이터 입력 (시드 데이터 활용)
X) Other (please describe after [Answer]: tag below)

[Answer]: A (관리자 화면에서 수행)

## Question 12
성별/나이 정보는 어떻게 수집하시겠습니까?

A) 고객이 주문 전 직접 선택 (성별/나이대 선택 화면 표시)
B) 관리자가 테이블 세션 시작 시 입력
C) 카메라/AI 기반 자동 추정 (얼굴 인식)
X) Other (please describe after [Answer]: tag below)

[Answer]: X, 고객이 주문 완료 후에 선택지 중 선택 (성별 (남/여), 나이대(10대/20대/30대/40대/50대 이상))

## Question 13
메뉴 추천은 어떤 방식으로 동작해야 하나요?

A) 규칙 기반 — 관리자가 성별/나이대별 추천 메뉴를 직접 설정
B) 주문 데이터 기반 — 동일 성별/나이대 고객들이 많이 주문한 메뉴를 자동 추천
C) AI/ML 기반 — 머신러닝 모델로 개인화 추천
X) Other (please describe after [Answer]: tag below)

[Answer]: B, 추천 전 (성별/나이대 체크하기)

## Question 14
메뉴 추천이 표시되는 위치와 시점은 어디인가요?

A) 메뉴 화면 상단에 "추천 메뉴" 섹션으로 항상 표시
B) 메뉴 화면 진입 시 팝업/모달로 추천 메뉴 표시
C) 장바구니가 비어있을 때만 메뉴 화면 상단에 표시
D) 별도의 "추천" 탭/페이지로 분리
X) Other (please describe after [Answer]: tag below)

[Answer]: X, 메뉴 화면 진입 후 1분 뒤 자동 모달 띄워주기

## Question 15
MVP 범위에 "추천 및 평가 시스템"이 추가되었는데, "평가" 기능은 어떤 것을 의미하나요?

A) 주문 완료 후 메뉴별 별점 평가 (1~5점)
B) 추천된 메뉴에 대한 좋아요/싫어요 피드백
C) 평가 기능은 제외 — 추천 기능만 구현
X) Other (please describe after [Answer]: tag below)

[Answer]: A, 각각 메뉴별로 평가

## Question 16: Security Extensions
보안 확장 규칙을 이 프로젝트에 적용하시겠습니까?

A) Yes — 모든 SECURITY 규칙을 blocking constraint로 적용 (프로덕션급 애플리케이션 권장)
B) No — SECURITY 규칙 스킵 (PoC, 프로토타입, 실험적 프로젝트에 적합)
X) Other (please describe after [Answer]: tag below)

[Answer]: B