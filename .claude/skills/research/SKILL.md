---
name: research
description: "키워드 기반 AI 1인 사업 아이디어 리서치. ai-solo-biz-researcher가 웹 검색 + 학술 조사로 10개 아이디어를 raw_ideas.md로 생성합니다."
argument-hint: "[키워드 (예: 교육, healthcare, 부동산)]"
disable-model-invocation: true
context: fork
agent: ai-solo-biz-researcher
---

다음 키워드를 기반으로 AI 1인 사업 아이디어 리서치를 수행하세요.

## 리서치 키워드
$ARGUMENTS

## 작업 지시
1. 위 키워드를 출발점으로 키워드 확장을 진행하세요
2. 확장된 키워드들로 트렌드 조사 (웹 검색)를 철저히 수행하세요
3. 논문/리포트 조사를 병행하세요
4. 최종적으로 10개의 AI 1인 사업 아이디어를 정리하세요
5. 결과를 raw_ideas.md 파일로 저장하세요

반드시 실제 웹 검색을 수행하여 최신 정보를 기반으로 아이디어를 도출하세요.
모든 아이디어에는 출처(URL 또는 논문명)가 반드시 포함되어야 합니다.
