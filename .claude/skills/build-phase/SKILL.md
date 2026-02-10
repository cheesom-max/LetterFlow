---
name: build-phase
description: "구축 Phase 핵심 파이프라인. product-builder → code-reviewer → code-maintainer를 순차 실행하여 mvp_spec.md에서 검증된 코드까지 자동 생성합니다."
argument-hint: "[옵션: with-devops]"
disable-model-invocation: true
---

구축 Phase 핵심 파이프라인을 실행합니다. MVP 기획서에서 검증된 코드까지 자동으로 생성합니다.

## 옵션
$ARGUMENTS

## 사전 조건 확인

실행 전 반드시 다음을 확인하세요:
1. Read 도구로 mvp_spec.md가 존재하는지 확인
2. 존재하지 않으면: "mvp_spec.md가 없습니다. /phase1을 먼저 실행하거나, mvp_spec.md를 준비해주세요." 안내 후 중단

---

## 실행 순서

### Stage 1: MVP 코드 생성 (product-builder)

사용자에게 "Stage 1 시작: MVP 코드 생성..." 안내

Task 도구를 사용하여 `product-builder` 에이전트에게 다음 작업을 위임하세요:

> mvp_spec.md를 읽고 실제 작동하는 MVP 코드를 project/ 디렉토리에 생성하세요.
> P0 기능만 완전히 구현하고, P1/P2는 TODO 주석으로 표시하세요.
> 빌드 검증(npm install, npm run build 등)까지 완료하세요.
> 배포 설정(vercel.json, Dockerfile 등)도 포함하세요.

Stage 1 완료 후 **품질 게이트**:
1. Glob 도구로 `project/**/*` 파일 수 확인
2. 파일이 5개 미만이면 사용자에게 "코드 생성이 불완전해 보입니다 (N개 파일). 재시도할까요?" 확인
3. 통과하면 사용자에게 "Stage 1 완료: project/에 N개 파일 생성. 코드 리뷰를 시작합니다." 안내

---

### Stage 2: 코드 리뷰 + 테스트 (code-reviewer)

사용자에게 "Stage 2 시작: 코드 리뷰 + 테스트 생성..." 안내

Task 도구를 사용하여 `code-reviewer` 에이전트에게 다음 작업을 위임하세요:

> project/ 코드를 mvp_spec.md 기준으로 리뷰하세요.
> OWASP 보안 감사, 성능 리뷰, 코드 품질 점검을 수행하고,
> unit/integration/E2E 테스트를 생성하여 실행하세요.
> 결과를 code_review_report.md로 저장하세요.

Stage 2 완료 후 **품질 판정**:
1. Read 도구로 code_review_report.md 읽기
2. `## Executive Summary` 섹션에서 등급(A~F)과 CRITICAL/WARNING 건수 추출
3. 사용자에게 리뷰 결과 보고: "등급: [X], CRITICAL: [N]건, WARNING: [N]건"

---

### Stage 3: 품질 판정 + 자동 수정

등급에 따라 분기:

**등급 A 또는 B**:
- 사용자에게 "코드 품질 양호 (등급 [X]). 수정 없이 진행합니다." 안내
- Stage 4로 이동

**등급 C 이하**:
- 사용자에게 "코드 품질 개선 필요 (등급 [X], CRITICAL [N]건). 자동 수정을 시작합니다." 안내
- Task 도구로 `code-maintainer` 에이전트에게 다음 작업을 위임하세요:

> code_review_report.md를 읽고 P0(즉시 수정) + P1(1주 내) 항목을 수정하세요.
> 보안 이슈 최우선으로 수정하고, 모든 수정에 테스트를 추가하세요.
> 빌드와 테스트가 통과하는지 확인하세요.
> 결과를 maintenance_report.md로 저장하세요.

수정 완료 후:
1. maintenance_report.md에서 수정 건수, 빌드/테스트 결과 확인
2. 사용자에게 수정 결과 보고
3. "추가 리뷰-수정이 필요하면 /quality-loop를 실행하세요." 안내

---

### Stage 4: 완료 보고 (+ 선택적 DevOps)

사용자에게 최종 보고:
- 생성된 코드 파일 수
- 리뷰 등급
- 수정 사항 요약 (있는 경우)
- 테스트 통과율

$ARGUMENTS에 'with-devops'가 포함되어 있으면:
- 사용자에게 "DevOps 설정을 시작합니다." 안내
- Task 도구로 `devops-deployer` 에이전트에게 위임:

> project/와 mvp_spec.md를 읽고 CI/CD 파이프라인, 모니터링 설정, 데이터베이스 백업, 보안 하드닝을 infra/ 디렉토리에 생성하세요.

'with-devops'가 없으면:
- "배포 설정이 필요하면 devops-deployer를 실행하세요." 안내

다음 단계 안내:
- `/quality-loop` — 추가 리뷰-수정 반복
- `content-marketer` — 마케팅 콘텐츠 생성
- `launch-executor` — 런칭 패키지 생성
- `/phase3` — 운영 Phase (분석, 가격, 이탈 방지)

## 중요 규칙
- mvp_spec.md 없이는 절대 시작하지 마세요.
- Stage 1 → 2 → 3 → 4 순서를 반드시 지키세요.
- 등급 A/B면 code-maintainer를 실행하지 마세요 (불필요한 수정 방지).
- 각 Stage 사이에 사용자에게 진행 상황을 안내하세요.
