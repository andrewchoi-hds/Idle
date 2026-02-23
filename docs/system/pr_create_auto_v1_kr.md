# PR 자동 생성/업데이트 v1

기준 시점: 2026-02-23  
대상 파일:
- `/Users/hirediversity/Idle/scripts/create_pr_with_body_v1.py`

## 1) 목적
- PR 생성 시 본문 품질(`Summary/Changes/Validation`)을 자동으로 확보한다.
- 이미 열려 있는 동일 브랜치 PR이 있으면 본문/제목을 자동 업데이트한다.

## 2) 기본 실행
```bash
cd /Users/hirediversity/Idle
npm run pr:create:auto
```
- 내부 동작:
  1. `origin/main` fetch
  2. 변경 범위(`origin/main..HEAD`) 확인
  3. `generate_pr_body_v1.py --run-validation` 실행
  4. `lint_pr_body_v1.py --strict-change-path` 실행
  5. `git push -u origin <head>`
  6. open PR 존재 시 `gh pr edit`, 없으면 `gh pr create`

## 3) 주요 옵션
- `--title "<text>"`: PR 제목 강제 지정
- `--draft`: 신규 PR을 Draft로 생성
- `--no-update-existing`: 기존 open PR이 있으면 실패
- `--allow-dirty`: 워킹트리 dirty 상태 허용
- `--dry-run`: 실제 생성 없이 실행 계획만 출력
- `--no-push`: PR 생성 전 `git push` 생략
- `--no-body-lint`: 본문 생성 후 품질 lint 생략

## 4) 비고
- 기본 본문 경로: `/private/tmp/idle_pr_body_v1.md`
- 현재 브랜치가 `main`이면 안전상 실패한다.
- 본문 품질 점검 기준은 `/Users/hirediversity/Idle/docs/system/pr_body_lint_v1_kr.md`를 따른다.
