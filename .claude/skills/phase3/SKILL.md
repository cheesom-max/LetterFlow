---
name: phase3
description: "운영 Phase 파이프라인. analytics-advisor + pricing-optimizer를 병렬 실행한 후 churn-preventer를 실행합니다."
disable-model-invocation: true
---

운영 Phase 파이프라인을 실행합니다. 분석 체계, 가격 전략, 이탈 방지 시스템을 한 번에 생성합니다.

## 사전 조건 확인

1. Read 도구로 mvp_spec.md 존재 확인
2. 없으면 "mvp_spec.md가 없습니다. /phase1 또는 mvp-spec-writer를 먼저 실행하세요." 안내 후 중단
3. gtm_strategy.md가 있으면 참조용으로 사용 (없어도 진행 가능)

---

## 실행 순서

### Stage 1: 분석 + 가격 (병렬)

사용자에게 "Stage 1 시작: 분석 체계 + 가격 전략 수립 (병렬 실행)..." 안내

다음 두 에이전트를 **동시에** Task 도구로 위임하세요 (두 개의 Task 호출을 한 메시지에):

**에이전트 1: analytics-advisor**
> mvp_spec.md를 읽고 KPI 프레임워크, 분석 도구 설정 가이드, 대시보드 구조, A/B 테스트 측정 인프라를 analytics/ 디렉토리에 생성하세요.
> gtm_strategy.md가 있으면 함께 참조하세요.

**에이전트 2: pricing-optimizer**
> mvp_spec.md를 읽고 경쟁사 가격 분석, 가치 기반 가격 책정, 티어 설계, LTV/CAC 시뮬레이션을 pricing_strategy.md로 생성하세요.
> gtm_strategy.md가 있으면 함께 참조하세요.

Stage 1 완료 후:
1. analytics/ 디렉토리 존재 확인 (Glob)
2. pricing_strategy.md 존재 확인 (Read)
3. 누락된 것이 있으면 사용자에게 보고
4. 사용자에게 두 에이전트의 핵심 결과 요약

---

### Stage 2: 이탈 방지 (churn-preventer)

사용자에게 "Stage 2 시작: 이탈 방지 시스템 구축..." 안내

Task 도구를 사용하여 `churn-preventer` 에이전트에게 다음 작업을 위임하세요:

> mvp_spec.md와 pricing_strategy.md를 읽고 던닝 이메일, 취소 플로우, win-back 시퀀스, 이탈 위험 신호 정의, 리텐션 메트릭을 retention/ 디렉토리에 생성하세요.

Stage 2 완료 후:
1. retention/ 디렉토리 존재 확인
2. 사용자에게 결과 요약

---

### 완료 보고

사용자에게 최종 보고:
- analytics/ 생성 파일 목록
- pricing_strategy.md 핵심 요약 (가격 구조, 추천 티어)
- retention/ 생성 파일 목록
- 다음 단계 안내:
  - `/phase4` — 성장 Phase (아웃리치, 피드백 분석)
  - `/finance-report` — 재무 리포트 생성
  - `content-marketer` — 마케팅 콘텐츠 생성

## 중요 규칙
- Stage 1의 두 에이전트는 반드시 병렬로 실행하세요 (비용/시간 절약).
- Stage 2는 pricing_strategy.md가 필요하므로 Stage 1 완료 후 실행하세요.
- pricing_strategy.md가 생성되지 않았으면 Stage 2에서 mvp_spec.md만으로 진행하되, 사용자에게 경고하세요.
