# PR 본문 생성기 회귀 체크 가이드 v1

기준 시점: 2026-02-24  
대상 파일:
- `/Users/hirediversity/Idle/scripts/check_pr_body_generator_regression_v1.py`
- `/Users/hirediversity/Idle/scripts/build_pr_body_generator_regression_ci_summary_v1.py`

## 1) 목적
- PR 본문 생성기 포맷이 변경 중 깨지지 않았는지 고정 케이스로 검증한다.
- Validation 체크박스 렌더링(항목/순서/체크 상태)과 Notes failure 출력 회귀를 감지한다.

## 2) 기본 실행
```bash
cd /Users/hirediversity/Idle
npm run pr:body:gen:regression:check
```
```bash
# JSON 리포트 생성
npm run pr:body:gen:regression:check:report

# Markdown 요약 생성
npm run pr:body:gen:regression:summary:md
```

## 3) 점검 시나리오
- `structure_with_diff_and_truncation`: 변경 파일 표시/축약/Summary 규모 정보 렌더링 점검
- `validation_failure_notes`: 실행된 validation 실패 내역 Notes 렌더링 점검
- `empty_diff_shape`: 변경/커밋이 없는 경우 기본 문구 렌더링 점검

## 4) CI 연계
- `verify-combat-diff` workflow에서 `PR Body Generator Regression` 단계를 실행한다.
- 이 단계 실패 시 Required Check 전체를 실패 처리한다.
- `PR Body Generator Regression Step Summary` 단계에서 케이스별 결과 테이블을 Step Summary에 기록한다.

## 5) 선택 옵션
- `--report-file <path>`: 케이스별 pass/fail JSON 리포트 출력
