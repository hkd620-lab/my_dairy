# my_diary

## What
my_diary는 개인 개발 과정을 기록하고,
DEVLOG를 기반으로 핵심 내용을 자동 요약·정리하는 일기형 프로젝트입니다.

## Why
개발 과정의 모든 기록(DEVLOG)은 보존하되,
외부에 공개할 정보는 선별된 요약본만 유지하기 위해
DEVLOG와 README를 분리된 구조로 설계했습니다.

## How
- 모든 작업 기록은 DEVLOG/YYYY-MM-DD 형식으로 누적 저장합니다.
- 최신 DEVLOG를 가리키는 DEVLOG_LAST.md를 자동 갱신합니다.
- DEVLOG_LAST.md를 기준으로 README 정리에 필요한 핵심 재료를 추출합니다.

## Core Feature
- DEVLOG_LAST를 자동으로 최신 DEVLOG로 갱신하는 스크립트
- DEVLOG를 기반으로 README를 정리하는 자동화 구조

## Rules
- DEVLOG는 전체 기록용이며, 삭제하지 않습니다.
- README.md에는 구조·규칙·재사용 가능한 설계만 기록합니다.
- 날짜, 감정, 시행착오는 README에 포함하지 않습니다.

