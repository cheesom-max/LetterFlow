---
name: pipeline
description: "AI 1인 사업 아이디어 발굴 전체 파이프라인. researcher(sonnet)가 10개 아이디어를 리서치한 후, evaluator(opus)가 수요 검증 및 평가를 수행하여 TOP 3를 선정합니다."
argument-hint: "[키워드 (예: 교육, fintech, healthcare)]"
disable-model-invocation: true
---

AI 1인 사업 아이디어 발굴 전체 파이프라인을 실행합니다.

## 리서치 키워드
$ARGUMENTS

## 파이프라인 실행 순서

### Phase 1: 리서치 (ai-solo-biz-researcher)
Task 도구를 사용하여 `ai-solo-biz-researcher` 에이전트에게 다음 작업을 위임하세요:

> 다음 키워드를 기반으로 AI 1인 사업 아이디어 리서치를 수행하세요.
> 키워드: $ARGUMENTS
> 트렌드 조사와 논문/리포트 조사를 철저히 수행하고, 10개의 아이디어를 raw_ideas.md로 저장하세요.
> 반드시 실제 웹 검색을 수행하여 최신 정보를 기반으로 아이디어를 도출하세요.
> 모든 아이디어에는 출처(URL 또는 논문명)가 반드시 포함되어야 합니다.

Phase 1이 완료될 때까지 기다리세요.

### 중간 검증
Phase 1 완료 후 raw_ideas.md 파일이 정상적으로 생성되었는지 Read 도구로 확인하세요.
- 파일이 없거나 비어있으면 사용자에게 보고하고 중단하세요.
- 파일이 정상이면 Phase 2로 진행하세요.

### Phase 2: 평가 (ai-biz-idea-evaluator)
Task 도구를 사용하여 `ai-biz-idea-evaluator` 에이전트에게 다음 작업을 위임하세요:

> raw_ideas.md 파일을 읽고 AI 1인 사업 아이디어를 평가하세요.
> 각 아이디어에 대해 수요 검증 웹 리서치를 수행하고, 5점 매트릭스(수요 강도, 경쟁 공백, 1인 실현성, 수익화 용이성, 성장 잠재력)로 채점하세요.
> TOP 3를 선정하고 상세 프로파일을 작성하여 결과를 final_ideas.md로 저장하세요.

Phase 2가 완료될 때까지 기다리세요.

### Phase 3: 완료 보고
두 에이전트가 모두 완료되면 final_ideas.md를 읽고 사용자에게 다음을 보고하세요:
- 리서치 키워드
- raw_ideas.md에서 생성된 아이디어 수
- TOP 3 아이디어 제목과 총점 요약

## 중요 규칙
- 반드시 Phase 1 → Phase 2 순서를 지키세요. 동시에 실행하지 마세요.
- 각 Phase의 진행 상황을 사용자에게 간략히 안내하세요.
- 에러 발생 시 (파일 미생성, 아이디어 부족 등) 사용자에게 명확히 보고하세요.
