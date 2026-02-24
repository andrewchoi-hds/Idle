# PR Validation 동기화 회귀 체크 가이드 v1

기준 시점: 2026-02-24  
대상 파일:
- `/Users/hirediversity/Idle/scripts/check_pr_validation_sync_regression_v1.py`
- `/Users/hirediversity/Idle/scripts/build_pr_validation_sync_regression_ci_summary_v1.py`

## 1) 목적
- PR Validation 체크리스트 동기화 스크립트 변경 시 핵심 동작(pass/fail/autofix)이 깨지지 않았는지 고정 fixture로 검증한다.
- 실패 케이스를 명시적으로 유지해 CI에서 품질 게이트로 재사용한다.

## 2) 기본 실행
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

## 3) 점검 시나리오
- `valid_template_pass`: 표준 명령과 일치한 템플릿 PASS
- `missing_command_fail`: 명령 누락 템플릿 FAIL
- `missing_command_write_autofix_pass`: 누락 템플릿 + `--write` 자동 보정 PASS
- `unexpected_command_fail`: 비표준 명령 포함 템플릿 FAIL
- `order_mismatch_fail`: 명령 순서 불일치 템플릿 FAIL

## 4) CI 연계
- `verify-combat-diff` workflow에서 `PR Validation Sync Regression` 단계를 실행한다.
- 이 단계 실패 시 Required Check 전체를 실패 처리한다.
- `PR Validation Sync Regression Step Summary` 단계에서 케이스별 결과 테이블을 Step Summary에 기록한다.

## 5) 선택 옵션
- `--report-file <path>`: 케이스별 pass/fail JSON 리포트 출력
