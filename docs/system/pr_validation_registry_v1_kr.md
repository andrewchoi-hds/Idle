# PR Validation 명령 레지스트리 가이드 v1

기준 시점: 2026-02-24  
대상 파일:
- `/Users/hirediversity/Idle/scripts/check_pr_validation_command_registry_v1.py`
- `/Users/hirediversity/Idle/scripts/pr_validation_commands_v1.py`
- `/Users/hirediversity/Idle/package.json`

## 1) 목적
- 표준 Validation 명령(`DEFAULT_VALIDATION_COMMANDS`)이 `package.json`의 `scripts`에 모두 등록되어 있는지 점검한다.
- Validation 명령 목록 변경 후 npm 스크립트 누락/오타로 인해 CI가 뒤늦게 깨지는 문제를 사전에 차단한다.

## 2) 기본 실행
```bash
cd /Users/hirediversity/Idle
npm run pr:validation:registry:check
```

## 3) 요약 파일 출력
```bash
npm run pr:validation:registry:check -- --summary-file /tmp/pr_validation_registry_summary_v1.md
```
- 출력 섹션:
  - Result(PASS/FAIL)
  - Expected command count
  - Missing script count
  - Unsupported command format count

## 4) 점검 규칙
- `DEFAULT_VALIDATION_COMMANDS`의 각 항목은 `npm run <script>` 형식이어야 한다.
- 추출한 `<script>` 키가 `package.json.scripts`에 존재해야 한다.

## 5) CI 연계
- `verify-combat-diff` workflow에서 `PR Validation Command Registry` 단계를 실행한다.
- 이 단계 실패 시 Required Check 전체를 실패 처리한다.
- 결과는 Step Summary의 `PR Validation Command Registry` 섹션에 기록된다.
