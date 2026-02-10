# 에이전트 역할 경계 맵

> 에이전트 간 책임이 겹칠 수 있는 영역을 명확하게 정리합니다.
> 새 에이전트 추가/수정 시 이 문서를 먼저 참조하세요.

---

## 1. 런칭/마케팅 콘텐츠 영역

| 업무 | 담당 | 비담당 |
|------|------|--------|
| SEO 블로그 작성 | #9 content-marketer | |
| SNS 포스트 (Twitter, LinkedIn, Instagram) | #9 content-marketer | |
| 마케팅 이메일 (웰컴, 업그레이드 유도, 뉴스레터) | #9 content-marketer | |
| 영상 스크립트 (YouTube, Shorts) | #9 content-marketer | |
| Product Hunt 런칭 패키지 | #10 launch-executor | ~~#9 content-marketer~~ |
| Hacker News Show HN 포스트 | #10 launch-executor | |
| Reddit 서브레딧별 맞춤 포스트 | #10 launch-executor | |
| 런칭 당일 시간대별 체크리스트 | #10 launch-executor | |
| 런칭 후 72시간 팔로업 | #10 launch-executor | |
| GTM 전략 수립 (채널 분석, 포지셔닝) | #4 gtm-strategist | |

**경계 규칙**: content-marketer는 "지속적 콘텐츠 생산", launch-executor는 "런칭 당일 일회성 실행 자료"

---

## 2. 이메일 영역

| 업무 | 담당 | 비담당 |
|------|------|--------|
| 마케팅 웰컴 이메일 (브랜드 소개, 가치 전달) | #9 content-marketer | |
| 제품 사용법 온보딩 이메일 (Day 0,1,3,7) | /customer-support 스킬 | ~~#9 content-marketer~~ |
| 업그레이드 유도 시퀀스 | #9 content-marketer | |
| 뉴스레터 템플릿 | #9 content-marketer | |
| 던닝 이메일 (결제 실패 대응) | #13 churn-preventer | |
| Win-back 이메일 (이탈 후 30/60/90일) | #13 churn-preventer | |
| 콜드 아웃리치 이메일 | #14 growth-sales | |

**경계 규칙**: 마케팅 목적 = content-marketer, 제품 사용법 = /customer-support, 결제/이탈 = churn-preventer, 세일즈 = growth-sales

---

## 3. 분석/실험 영역

| 업무 | 담당 | 비담당 |
|------|------|--------|
| KPI 프레임워크 설계 (North Star, AARRR) | #11 analytics-advisor | |
| 분석 도구 설정 가이드 (GA, Mixpanel 등) | #11 analytics-advisor | |
| 대시보드 설계 (경영/성장/재무) | #11 analytics-advisor | |
| A/B 테스트 도구 설정 + 결과 해석 | #11 analytics-advisor | |
| A/B 실험 가설 설계 + ICE 우선순위 | #14 growth-sales | ~~#11 analytics-advisor~~ |
| 바이럴 루프 설계 | #14 growth-sales | |
| 퍼널 실험 (전환율 최적화) | #14 growth-sales | |
| SaaS 지표 추적 (MRR, Churn, LTV) | #11 analytics-advisor | |

**경계 규칙**: analytics-advisor = "무엇을 어떻게 측정할 것인가" (인프라), growth-sales = "무엇을 실험할 것인가" (실행)

---

## 4. 경쟁사 분석 영역

| 업무 | 담당 | 비담당 |
|------|------|--------|
| 초기 경쟁사 식별 + 시장 분석 | #1 evaluator | |
| 경쟁사 대비 포지셔닝 전략 | #4 gtm-strategist | |
| 경쟁사 실제 가격 페이지 분석 | #12 pricing-optimizer | |
| 경쟁사 사용자 리뷰 분석 (차분만) | #15 feedback-analyzer | |

**경계 규칙**: feedback-analyzer는 기존 분석(evaluator, gtm)을 먼저 참조한 후 "최신 리뷰에서 새로 발견된 것"만 추가 리서치

---

## 5. 코드/인프라 영역

| 업무 | 담당 | 비담당 |
|------|------|--------|
| MVP 코드 전체 생성 | #5 product-builder | |
| 보안 감사 (OWASP), 성능 리뷰 | #6 code-reviewer | |
| 테스트 코드 생성 | #6 code-reviewer | |
| 버그 수정, 보안 패치, 기능 추가 | #7 code-maintainer | |
| CI/CD 파이프라인 (GitHub Actions) | #8 devops-deployer | |
| 배포 자동화 (Vercel/Railway/Fly.io) | #8 devops-deployer | |
| 모니터링 (UptimeRobot, Sentry) | #8 devops-deployer | |
| DB 백업, 보안 하드닝 | #8 devops-deployer | |
| 장애 대응 런북 | #8 devops-deployer | |

**경계 규칙**: product-builder = "처음 만들기", code-reviewer = "검증", code-maintainer = "고치기", devops-deployer = "배포+운영 인프라"

---

## 6. 가격/재무 영역

| 업무 | 담당 | 비담당 |
|------|------|--------|
| 경쟁사 가격 분석 + 가격 모델 설계 | #12 pricing-optimizer | |
| 심리적 가격 전략, 플랜 구조 | #12 pricing-optimizer | |
| P&L, 캐시플로우, 세금 전략 | /finance-report 스킬 | |
| 비용 최적화 제안 | /finance-report 스킬 | |
| 던닝 (결제 실패 회수) | #13 churn-preventer | |
| 취소 플로우 (할인/다운그레이드 제안) | #13 churn-preventer | |

**경계 규칙**: pricing-optimizer = "가격을 어떻게 정할 것인가", churn-preventer = "정해진 가격에서 이탈을 어떻게 막을 것인가", /finance-report = "돈이 어떻게 흐르는가"

---

## 7. 고객 지원 영역

| 업무 | 담당 | 비담당 |
|------|------|--------|
| FAQ 생성 | /customer-support 스킬 | |
| 챗봇 대화 플로우 | /customer-support 스킬 | |
| 티켓 분류 + SLA 정의 | /customer-support 스킬 | |
| 온보딩 가이드 + 이메일 | /customer-support 스킬 | |
| 응대 템플릿 15종 | /customer-support 스킬 | |
| NPS/CSAT 설문 설계 | #15 feedback-analyzer | |
| 피드백 감성 분석 + PMF 진단 | #15 feedback-analyzer | |

**경계 규칙**: /customer-support = "고객에게 직접 보여주는 것" (FAQ, 템플릿), feedback-analyzer = "고객으로부터 받는 것" (설문, 분석)

---

## 8. 제품 개선 영역

| 업무 | 담당 | 비담당 |
|------|------|--------|
| 전략적 제품 감사 + 개선 로드맵 | #16 product-auditor | |
| 시장 재조사 + 경쟁사 변화 분석 | #16 product-auditor | ~~#1 evaluator~~ (초기만) |
| 기능 갭 분석 (기획 vs 구현 vs 경쟁사) | #16 product-auditor | |
| 기술 부채 평가 + 의존성 노후화 | #16 product-auditor | |
| UX 감사 (플로우, 전환율, 접근성) | #16 product-auditor | |
| ICE 우선순위 개선 로드맵 | #16 product-auditor | ~~#14 growth-sales~~ (실험만) |
| 코드 레벨 보안/성능 감사 | #6 code-reviewer | ~~#16 product-auditor~~ |
| 실제 코드 수정 | #7 code-maintainer | ~~#16 product-auditor~~ |
| 사용자 피드백 수집/분석 | #15 feedback-analyzer | ~~#16 product-auditor~~ |

**경계 규칙**: product-auditor = "무엇을 왜 개선해야 하는가" (전략), code-reviewer = "코드가 안전한가" (검증), code-maintainer = "실제로 고친다" (실행), feedback-analyzer = "사용자가 뭘 원하는가" (데이터)
