# 테이블오더 프로젝트 — 협업 계획

## 브랜치 전략

```
main
  |
  +-- feature/BE-auth          (BE)
  +-- feature/BE-menu          (BE)
  +-- feature/BE-order-sse     (BE)
  +-- feature/BE-recommendation-rating (BE)
  +-- feature/FE-auth-setup    (FE)
  +-- feature/FE-menu          (FE)
  +-- feature/FE-order-cart    (FE)
  +-- feature/FE-admin-dashboard (FE)
  +-- feature/FE-recommendation-rating (FE)
  ...
```

- `main`에서 직접 작업 브랜치를 생성
- 작업 완료 후 `main`으로 PR 머지

---

## 작업 디렉토리 규칙

**각 포지션은 반드시 자신의 지정 디렉토리에서만 작업합니다.**

| 포지션 | 작업 디렉토리 | 설명 |
|---|---|---|
| **FE** | `frontend/` | React TypeScript 프론트엔드 코드 |
| **BE** | `backend/` | Spring Boot 백엔드 코드 |
| **PO** | `QA/` | 테스트 계획, 수용 기준, QA 산출물 |

```
aidlc-table-order/
+-- frontend/    <-- FE 개발자 작업 영역 (React TypeScript)
+-- backend/     <-- BE 개발자 작업 영역 (Spring Boot)
+-- QA/          <-- PO 작업 영역 (테스트 계획, 수용 검증)
+-- aidlc-docs/  <-- 공통 문서 (설계, 요구사항, 계획)
+-- requirements/ <-- 요구사항 원본
+-- plan.md      <-- 이 문서
```

**주의사항:**
- 다른 포지션의 디렉토리에 있는 코드를 직접 수정하지 않습니다
- 공통 문서(`aidlc-docs/`, `requirements/`, `plan.md`)는 모든 포지션이 참조 가능
- API 계약 변경 시 `component-methods.md`를 먼저 수정하고 팀에 공유

---

## 포지션별 참고 문서

### PO (Product Owner)

전체 요구사항과 진행 상황을 파악하고, 각 단계별 승인을 수행합니다.

| 문서 | 경로 | 용도 |
|---|---|---|
| **요구사항 원본** | `requirements/table-order-requirements.md` | 원본 기능 요구사항 확인 |
| **제외 사항** | `requirements/constraints.md` | 구현하지 않는 기능 범위 확인 |
| **정제된 요구사항** | `aidlc-docs/inception/requirements/requirements.md` | 확정된 기능/비기능 요구사항, MVP 범위, 기술 스택 |
| **실행 계획** | `aidlc-docs/inception/plans/execution-plan.md` | 전체 워크플로우 진행 상황 추적 |
| **설계 요약** | `aidlc-docs/inception/application-design/application-design.md` | 시스템 전체 구조 요약 (컴포넌트, API, 서비스) |
| **상태 추적** | `aidlc-docs/aidlc-state.md` | 현재 단계 및 완료 현황 |

**PO 체크리스트:**
- [ ] 각 유닛별 요구사항이 `requirements.md`와 일치하는지 검증
- [ ] BE/FE PR 머지 전 기능 수용 검증
- [ ] 유닛 완료 시 통합 테스트 확인

---

### BE (Backend Engineer)

Spring Boot API, DB 스키마, SSE, S3 연동, 인증을 구현합니다.

| 문서 | 경로 | 용도 |
|---|---|---|
| **API 명세 (핵심)** | `aidlc-docs/inception/application-design/component-methods.md` | 모든 API 엔드포인트, 메서드 시그니처, 입출력 DTO 정의 |
| **서비스 설계 (핵심)** | `aidlc-docs/inception/application-design/services.md` | 서비스별 책임, 오케스트레이션 플로우 (주문 생성, 세션 종료 등) |
| **의존성/데이터 흐름** | `aidlc-docs/inception/application-design/component-dependency.md` | 컴포넌트 간 의존성 매트릭스, 데이터 흐름 다이어그램, 순환 의존 방지 |
| **컴포넌트 정의** | `aidlc-docs/inception/application-design/components.md` | 백엔드 8개 도메인 책임, 패키지 구조 (혼합: 도메인별 + 레이어) |
| **요구사항** | `aidlc-docs/inception/requirements/requirements.md` | 기능 요구사항 및 비기능 요구사항 (SSE 2초, JWT 16시간 등) |

**BE 작업 시 핵심 참고 순서:**
1. `component-methods.md` → API 엔드포인트 및 DTO 확인
2. `services.md` → 비즈니스 로직 오케스트레이션 흐름 확인
3. `component-dependency.md` → 서비스 간 의존성 및 호출 관계 확인
4. `requirements.md` → 비기능 요구사항 (성능, 인증 규격) 확인

---

### FE (Frontend Engineer)

React TypeScript UI, 상태 관리(Zustand/React Query), 고객용/관리자용 화면을 구현합니다.

| 문서 | 경로 | 용도 |
|---|---|---|
| **프론트엔드 구조 (핵심)** | `aidlc-docs/inception/application-design/components.md` | 페이지 목록, 라우팅, 상태 관리 (Zustand Store, React Query Hook), Shared 컴포넌트 |
| **API 연동 (핵심)** | `aidlc-docs/inception/application-design/component-methods.md` | BE API 엔드포인트, Request/Response DTO — React Query Hook 작성 시 참조 |
| **설계 요약** | `aidlc-docs/inception/application-design/application-design.md` | 전체 시스템 구조, 설계 결정 사항 요약 |
| **요구사항** | `aidlc-docs/inception/requirements/requirements.md` | UI/UX 요구사항 (카드 레이아웃, 44x44px 버튼, 추천 모달 1분 타이머 등) |

**FE 작업 시 핵심 참고 순서:**
1. `components.md` → 담당 페이지, 라우팅 경로, 상태 관리 구조 확인
2. `component-methods.md` → API 엔드포인트/DTO 확인 → Mock API 또는 실제 연동
3. `requirements.md` → UI/UX 세부 요구사항 확인 (터치 크기, 자동 리다이렉트 등)

---

## BE/FE 연동 기준 문서

**`component-methods.md`가 BE/FE 공통 계약(Contract)입니다.**

- BE는 이 문서의 API 명세대로 구현
- FE는 이 문서의 API 명세대로 호출
- API 변경이 필요한 경우, `component-methods.md`를 먼저 수정 후 양쪽에 공유

---

## 문서 구조 요약

```
aidlc-table-order/
+-- plan.md                          <-- 이 문서 (전체 협업 계획)
+-- frontend/                        <-- FE 작업 영역
+-- backend/                         <-- BE 작업 영역
+-- QA/                              <-- PO 작업 영역
+-- requirements/
|   +-- table-order-requirements.md  <-- PO: 원본 요구사항
|   +-- constraints.md               <-- PO: 제외 사항
+-- aidlc-docs/
    +-- aidlc-state.md               <-- PO: 진행 상황 추적
    +-- inception/
        +-- requirements/
        |   +-- requirements.md      <-- ALL: 확정 요구사항 (공통 참고)
        +-- plans/
        |   +-- execution-plan.md    <-- PO: 실행 계획
        +-- application-design/
            +-- application-design.md    <-- ALL: 설계 요약
            +-- components.md            <-- FE(핵심) + BE
            +-- component-methods.md     <-- BE(핵심) + FE(핵심) = 공통 계약
            +-- services.md              <-- BE(핵심)
            +-- component-dependency.md  <-- BE
```
