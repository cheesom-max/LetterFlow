---
name: phase4
description: "성장 Phase 파이프라인. growth-sales와 feedback-analyzer를 병렬 실행합니다."
disable-model-invocation: true
---

성장 Phase 파이프라인을 실행합니다. 아웃리치/성장 전략과 피드백 분석 체계를 동시에 생성합니다.

## 사전 조건 확인

1. Read 도구로 mvp_spec.md 존재 확인
2. 없으면 "mvp_spec.md가 없습니다. /phase1 또는 mvp-spec-writer를 먼저 실행하세요." 안내 후 중단
3. gtm_strategy.md 존재 여부 확인 (없어도 진행 가능, 경고만 표시)

---

## 실행 순서

### Stage 1: 성장 + 피드백 (병렬)

사용자에게 "성장 Phase 시작: 아웃리치/성장 전략 + 피드백 분석 체계 (병렬 실행)..." 안내

다음 두 에이전트를 **동시에** Task 도구로 위임하세요 (두 개의 Task 호출을 한 메시지에):

**에이전트 1: growth-sales**
> mvp_spec.md를 읽고 ICP(이상적 고객 프로필) 리서치, 콜드 이메일/LinkedIn 아웃리치 템플릿, 반론 처리 스크립트, 바이럴 루프 설계, 퍼널 실험 계획을 growth/ 디렉토리에 생성하세요.
> gtm_strategy.md가 있으면 함께 참조하세요.

**에이전트 2: feedback-analyzer**
> mvp_spec.md를 읽고 피드백 수집 체계(NPS/CSAT 설문 설계), 분석 프레임워크, 기능 요청 우선순위화 방법, PMF 진단 기준을 feedback_report.md로 생성하세요.
> 기존 피드백 데이터가 있으면 함께 분석하세요.

Stage 1 완료 후:
1. growth/ 디렉토리 존재 확인 (Glob)
2. feedback_report.md 존재 확인 (Read)
3. 누락된 것이 있으면 사용자에게 보고

---

### 완료 보고

사용자에게 최종 보고:
- growth/ 핵심 내용 요약 (ICP, 아웃리치 채널, 실험 계획)
- feedback_report.md 핵심 내용 요약 (설문 설계, 분석 기준)
- 반복 사이클 안내:
  - "피드백 수집 후: feedback-analyzer로 분석 → code-maintainer로 제품 개선"
  - "성장 실험 후: analytics-advisor로 결과 측정 → 다음 실험 설계"
  - "이탈 모니터링: churn-preventer 리텐션 시퀀스 최적화"

## 중요 규칙
- 두 에이전트는 독립적이므로 반드시 병렬 실행하세요.
- gtm_strategy.md가 없으면 growth-sales에게 mvp_spec.md만으로 진행하되, "GTM 전략 없이 진행합니다" 경고를 포함하세요.
