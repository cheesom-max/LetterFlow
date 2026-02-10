# AI 1인 사업가 에이전트 파이프라인

> 이 디렉토리에서 `claude`를 실행하면 17개 에이전트와 6개 스킬을 모두 사용할 수 있습니다.
> 파일 복사 없이, 모든 산출물이 현재 디렉토리에 직접 생성됩니다.

## 전체 파이프라인 흐름

```
Phase 1: 기획 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  키워드 → [researcher] → raw_ideas.md
               ↓
          [evaluator] → final_ideas.md
               ↓
          [mvp-spec-writer] → mvp_spec.md
               ↓
     ┌─── [landing-page-builder] → landing/
     └─── [gtm-strategist] → gtm_strategy.md

Phase 2: 구축 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  mvp_spec.md → [product-builder] → project/
  project/ → [code-reviewer] → code_review_report.md + tests
  project/ → [code-maintainer] → updated project/
  project/ → [devops-deployer] → infra/
  gtm_strategy.md → [content-marketer] → content/
  gtm_strategy.md → [launch-executor] → launch/

Phase 3: 운영 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  mvp_spec.md → [analytics-advisor] → analytics/
  mvp_spec.md → [pricing-optimizer] → pricing_strategy.md
  pricing_strategy.md → [churn-preventer] → retention/

Phase 4: 성장 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  mvp_spec.md + gtm → [growth-sales] → growth/
  피드백 데이터 → [feedback-analyzer] → feedback_report.md

제품 개선 (반복) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  project/ + mvp_spec.md → [product-auditor] → improvement_plan.md
```

## 에이전트 빠른 호출 가이드

| 하고 싶은 일 | 에이전트 | 스킬 |
|-------------|---------|------|
| 아이디어 리서치 | ai-solo-biz-researcher | /research |
| 아이디어 평가 | ai-biz-idea-evaluator | /evaluate |
| 리서치→평가 한번에 | — | /pipeline |
| MVP 기획서 | mvp-spec-writer | — |
| 랜딩페이지 | landing-page-builder | — |
| GTM 전략 | gtm-strategist | — |
| 제품 코드 빌드 | product-builder | — |
| 코드 리뷰 | code-reviewer | — |
| 코드 수정 | code-maintainer | — |
| 인프라/배포 | devops-deployer | — |
| 마케팅 콘텐츠 | content-marketer | — |
| 런칭 패키지 | launch-executor | — |
| 분석 체계 | analytics-advisor | — |
| 가격 전략 | pricing-optimizer | — |
| 이탈 방지 | churn-preventer | — |
| 성장/세일즈 | growth-sales | — |
| 피드백 분석 | feedback-analyzer | — |
| 제품 감사/개선 로드맵 | product-auditor | — |
| FAQ/챗봇 | — | /customer-support |
| 법률 문서 | — | /legal-docs |
| 재무 리포트 | — | /finance-report |

에이전트가 불확실하면 사용자에게 어떤 에이전트를 쓸지 물어보세요.

## 에이전트 상세

### Phase 1: 기획
| 에이전트 | 모델 | 입력 | 출력 |
|----------|------|------|------|
| ai-solo-biz-researcher | sonnet | 키워드 | raw_ideas.md |
| ai-biz-idea-evaluator | opus | raw_ideas.md | final_ideas.md |
| mvp-spec-writer | opus | final_ideas.md | mvp_spec.md |
| landing-page-builder | sonnet | mvp_spec.md | landing/ |
| gtm-strategist | opus | mvp_spec.md + final_ideas.md | gtm_strategy.md |

### Phase 2: 구축
| 에이전트 | 모델 | 입력 | 출력 |
|----------|------|------|------|
| product-builder | opus | mvp_spec.md | project/ |
| code-reviewer | opus | project/ + mvp_spec.md | code_review_report.md |
| code-maintainer | opus | project/ + code_review_report.md | maintenance_report.md |
| devops-deployer | opus | project/ + mvp_spec.md | infra/ |
| content-marketer | sonnet | gtm_strategy.md + mvp_spec.md | content/ |
| launch-executor | sonnet | gtm_strategy.md + mvp_spec.md | launch/ |

### Phase 3: 운영
| 에이전트 | 모델 | 입력 | 출력 |
|----------|------|------|------|
| analytics-advisor | opus | mvp_spec.md + gtm_strategy.md | analytics/ |
| pricing-optimizer | opus | mvp_spec.md + gtm_strategy.md | pricing_strategy.md |
| churn-preventer | sonnet | mvp_spec.md + pricing_strategy.md | retention/ |

### Phase 4: 성장
| 에이전트 | 모델 | 입력 | 출력 |
|----------|------|------|------|
| growth-sales | opus | mvp_spec.md + gtm_strategy.md | growth/ |
| feedback-analyzer | opus | 피드백 데이터 + mvp_spec.md | feedback_report.md |

### 제품 개선
| 에이전트 | 모델 | 입력 | 출력 |
|----------|------|------|------|
| product-auditor | opus | project/ + mvp_spec.md | improvement_plan.md |

## 실행 순서

### 최소 경로 (MVP 런칭까지)
```
researcher → evaluator → mvp-spec-writer → product-builder → landing-page-builder → launch-executor
```

### 전체 순서
```
Phase 1: researcher → evaluator → mvp-spec-writer → landing + gtm (병렬)
Phase 2: product-builder → code-reviewer → code-maintainer → devops-deployer → content + launch (병렬)
Phase 3: analytics + pricing (병렬) → churn-preventer
Phase 4: growth-sales + feedback-analyzer (병렬)
```

## 파일 의존성
```
raw_ideas.md → final_ideas.md → mvp_spec.md (핵심 파이프라인)
                                     ↓
                              거의 모든 에이전트가 참조

project/ → code_review_report.md → maintenance_report.md
gtm_strategy.md → content/ → launch/
pricing_strategy.md → retention/
```

## 공통 규칙
- 산출물: **한국어** (기술 용어 영어 허용)
- 리서치: 한국어 + 영어 병행
- 모든 에이전트는 **증거 기반** (추측 금지)
- **1인 사업가 실현 가능성** 필수
- 법률/세무 관련은 반드시 전문가 검토 권고
