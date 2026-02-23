# PR 본문 Lint 회귀 체크 가이드 v1

기준 시점: 2026-02-23  
대상 파일:
- `/Users/hirediversity/Idle/scripts/check_pr_body_lint_regression_v1.py`

## 1) 목적
- PR 본문 lint 규칙 변경 시 기존 품질 게이트가 깨지지 않았는지 빠르게 검증한다.
- pass/fail fixture를 고정해 lint 스크립트 동작의 회귀를 감지한다.

## 2) 기본 실행
```bash
cd /Users/hirediversity/Idle
npm run pr:body:lint:regression:check
```
```bash
# JSON 리포트 생성
npm run pr:body:lint:regression:check:report

# Markdown 요약 생성
npm run pr:body:lint:regression:summary:md
```

## 3) 점검 시나리오
- `body_file_valid_strict_pass`: body 파일 입력 + strict path 통과
- `body_file_relative_change_strict_fail`: 상대 경로 변경 항목 strict 실패
- `event_json_valid_pass`: GitHub event JSON 입력 통과
- `event_json_invalid_fail`: 부실 본문(placeholder/누락) 실패
- 정상 케이스의 `Validation` 체크리스트는 `pr_validation_commands_v1.py` 표준 명령 목록을 기준으로 생성된다.

## 4) CI 연계
- `verify-combat-diff` workflow에서 `PR Body Lint Regression` 단계를 실행한다.
- 이 단계 실패 시 Required Check 전체가 실패 처리된다.
- `PR Body Lint Regression Step Summary` 단계에서 케이스별 결과 테이블을 `GITHUB_STEP_SUMMARY`에 기록한다.

## 5) 선택 옵션
- `--report-file <path>`: 케이스별 pass/fail JSON 리포트 출력
