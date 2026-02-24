# PR Required Check 커버리지 가이드 v1

기준 시점: 2026-02-24  
대상 파일:
- `/Users/hirediversity/Idle/scripts/check_required_check_coverage_v1.py`
- `/Users/hirediversity/Idle/scripts/pr_validation_commands_v1.py`
- `/Users/hirediversity/Idle/.github/workflows/combat-diff-ci.yml`

## 1) 목적
- 표준 Validation 명령(`DEFAULT_VALIDATION_COMMANDS`)이 Required Check workflow에 빠짐없이 반영됐는지 검증한다.
- Validation 명령 목록이 늘어날 때 workflow 누락으로 인한 품질 게이트 공백을 사전에 차단한다.

## 2) 기본 실행
```bash
cd /Users/hirediversity/Idle
npm run pr:required-check:coverage:check
```
- 기본 점검 대상: `/Users/hirediversity/Idle/.github/workflows/combat-diff-ci.yml`

## 3) 요약 파일 출력
```bash
npm run pr:required-check:coverage:check -- --summary-file /tmp/pr_required_check_coverage_summary_v1.md
```
- 출력 섹션:
  - Result(PASS/FAIL)
  - Expected/Covered command count
  - 누락 명령 목록(실패 시)

## 4) 점검 규칙
- `DEFAULT_VALIDATION_COMMANDS`의 각 명령이 workflow 본문에 존재해야 한다.
- `:check` 계열 명령은 workflow에서 `:check:report` 변형으로 실행되어도 커버된 것으로 인정한다.
  - 예: `npm run pr:body:lint:regression:check` ↔ `npm run pr:body:lint:regression:check:report`

## 5) CI 연계
- `verify-combat-diff` workflow에서 `PR Required Check Coverage` 단계를 실행한다.
- 이 단계 실패 시 Required Check 전체를 실패 처리한다.
- 결과는 Step Summary의 `PR Required Check Coverage` 섹션에 기록된다.
