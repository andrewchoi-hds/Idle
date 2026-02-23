# GitHub Required Check 설정 가이드 v1

## 1) 목적
- PR 머지 전에 최소 품질 게이트(`PR 본문 lint`, `typecheck`, `TS/PY combat diff suite`)를 강제한다.

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

## 6) 플랜/가시성 제약 이력
- 2026-02-23 기준, 개인 무료 플랜의 `private` 저장소는 Branch Protection(Required Check) API/설정이 제한될 수 있다.
- 실제로 `private` 상태에서 아래 응답이 발생했다.
  - `Upgrade to GitHub Pro or make this repository public to enable this feature.`

## 7) 현재 적용 상태
- 저장소를 `public`으로 전환한 뒤 `main` 브랜치 보호 규칙을 적용했다.
- 적용 규칙:
  - Required status check: `verify-combat-diff`
  - strict mode: `true`
  - enforce admins: `true`
  - PR 승인 수: `1`
  - stale review 무효화: `true`
  - conversation 해결 필수: `true`

## 8) CI 트리거 최적화(중복 실행 방지)
- `verify-combat-diff` 워크플로우 트리거를 아래처럼 운영한다.
  - `pull_request`: PR 검증 실행
  - `push`는 `main`만 허용: 머지 후 기본 브랜치 검증
- 목적:
  - PR 브랜치 push 시 `push + pull_request` 이중 실행을 줄여 체크 가시성을 단순화
  - 실행 큐/리소스 낭비 감소
- 추가로 workflow `concurrency`를 적용해 동일 ref의 중복 실행을 자동 취소한다.

## 9) PR 본문 품질 게이트
- `verify-combat-diff`는 `pull_request` 이벤트에서 PR 본문 lint 단계를 선행한다.
  - 실행 명령: `python3 scripts/lint_pr_body_v1.py --event-json "$GITHUB_EVENT_PATH"`
- 확인 항목:
  - `Summary/Changes/Validation/Docs/Notes` 섹션 존재
  - 템플릿 placeholder 제거 여부
  - Validation 체크리스트 표준 명령 포함 여부
- 결과 가시성:
  - lint 성공/실패 모두 GitHub Step Summary에 `PR Body Lint` 섹션으로 기록
- 목적:
  - 빈/부실한 PR 본문을 Required Check 단계에서 직접 차단
  - 로컬 `pr:create:auto`와 서버 CI 품질 기준 일치

## 10) 대응 옵션 (참고)
1. 저장소를 `public`으로 전환 후 Required Check 적용
2. GitHub Pro(또는 Team/Enterprise) 플랜으로 전환 후 `private` 유지 상태에서 적용
3. 플랜 전환 전까지는 CI 결과를 참고해 수동 게이트로 운영
