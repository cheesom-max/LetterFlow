---
name: evaluate
description: "raw_ideas.md의 아이디어를 수요 검증 + 5점 매트릭스로 평가하여 TOP 3를 final_ideas.md로 산출합니다."
argument-hint: "[옵션: 추가 지시사항 (예: Notion에도 저장해줘)]"
disable-model-invocation: true
context: fork
agent: ai-biz-idea-evaluator
---

raw_ideas.md 파일을 읽고 AI 1인 사업 아이디어 평가를 수행하세요.

## 작업 지시
1. raw_ideas.md 파일에서 아이디어 목록을 파싱하세요
2. 각 아이디어에 대해 수요 검증 웹 리서치를 수행하세요
3. 5점 평가 매트릭스 (수요 강도, 경쟁 공백, 1인 실현성, 수익화 용이성, 성장 잠재력)로 채점하세요
4. TOP 3를 선정하고 상세 프로파일을 작성하세요
5. 결과를 final_ideas.md 파일로 저장하세요

$ARGUMENTS
