# GitHub Required Check 설정 가이드 v1

## 1) 목적
- PR 머지 전에 최소 품질 게이트(`typecheck`, `TS/PY combat diff suite`)를 강제한다.

## 2) 사전 조건
- 워크플로우 파일이 기본 브랜치에 반영되어 있어야 한다.
  - `/Users/hirediversity/Idle/.github/workflows/combat-diff-ci.yml`
- 최소 1회 이상 Actions 실행 이력이 있어야 체크 이름이 UI에 안정적으로 노출된다.

## 3) 설정 경로
1. GitHub 저장소 페이지 이동
2. `Settings` -> `Branches`
3. 보호할 브랜치 규칙(예: `main`)을 `Add rule` 또는 `Edit rule`
4. `Require status checks to pass before merging` 활성화
5. 체크 목록에서 `verify-combat-diff` 선택
6. 필요 시 아래 옵션 추가:
   - `Require branches to be up to date before merging`
   - `Require conversation resolution before merging`
7. `Save changes`

## 4) 권장 정책
- 최소 Required Check:
  - `verify-combat-diff`
- 권장 머지 방식:
  - squash merge(히스토리 단순화)
- 직접 push 제한:
  - 기본 브랜치 직접 push 제한 후 PR만 허용

## 5) 문제 해결
- 체크가 목록에 안 보일 때:
  - 워크플로우를 수동 실행(`workflow_dispatch`) 후 다시 확인
- 체크 이름이 바뀌어 Required Check가 깨졌을 때:
  - 워크플로우 `job id`를 고정(`verify-combat-diff`)하고 규칙을 다시 저장
