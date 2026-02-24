# PR Validation 체크리스트 동기화 가이드 v1

기준 시점: 2026-02-23  
대상 파일:
- `/Users/hirediversity/Idle/scripts/pr_validation_commands_v1.py`
- `/Users/hirediversity/Idle/scripts/check_pr_validation_template_sync_v1.py`
- `/Users/hirediversity/Idle/scripts/check_pr_validation_sync_regression_v1.py`

## 1) 목적
- PR 템플릿의 `Validation` 체크리스트와 자동화 스크립트의 표준 검증 명령 목록 불일치를 사전에 차단한다.
- `Validation` 커맨드 변경 시 단일 소스만 수정하고 나머지는 검증으로 보호한다.

## 2) 단일 소스
- 표준 검증 명령은 `/Users/hirediversity/Idle/scripts/pr_validation_commands_v1.py`의 `DEFAULT_VALIDATION_COMMANDS`를 기준으로 한다.
- 아래 도구가 이 목록을 공통 사용한다.
  - `generate_pr_body_v1.py`
  - `lint_pr_body_v1.py`
  - `check_pr_body_lint_regression_v1.py`

## 3) 동기화 점검 실행
```bash
cd /Users/hirediversity/Idle
npm run pr:validation:sync:check
```
- 자동 보정(템플릿 Validation 섹션 재작성):
```bash
npm run pr:validation:sync:apply
```
- 요약 파일 출력:
```bash
npm run pr:validation:sync:check -- --summary-file /tmp/pr_validation_sync_summary_v1.md
```
- 점검 내용:
  - `.github/pull_request_template.md`의 `## Validation` 섹션 체크박스 명령
  - `DEFAULT_VALIDATION_COMMANDS`와 항목/순서 완전 일치 여부

## 4) CI 연계
- `verify-combat-diff` workflow에서 `PR Validation Checklist Sync` 단계를 실행한다.
- 불일치가 발견되면 Required Check를 실패시켜 merge를 차단한다.
- 동기화 점검 결과는 Step Summary의 `PR Validation Checklist Sync` 섹션에 기록된다.

## 5) 회귀 체크
```bash
cd /Users/hirediversity/Idle
npm run pr:validation:sync:regression:check
```
```bash
# JSON 리포트 생성
npm run pr:validation:sync:regression:check:report

# Markdown 요약 생성
npm run pr:validation:sync:regression:summary:md
```
- `verify-combat-diff` workflow에서 `PR Validation Sync Regression` 단계를 실행한다.
- 회귀 결과 테이블은 Step Summary의 `PR Validation Sync Regression Summary` 섹션에 기록된다.
