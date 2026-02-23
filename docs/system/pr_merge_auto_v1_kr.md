# PR 자동 머지 v1

기준 시점: 2026-02-23  
대상 파일:
- `/Users/hirediversity/Idle/scripts/merge_pr_when_ready_v1.py`

## 1) 목적
- open PR의 Required Check 상태를 대기한 뒤, 통과 시 자동으로 머지한다.
- 반복적인 `gh pr checks`/`gh pr merge` 수동 절차를 줄인다.

## 2) 기본 실행
```bash
cd /Users/hirediversity/Idle
npm run pr:merge:auto
```
- 기본값:
  - `base=main`
  - `method=squash`
  - `delete-branch=true`
  - `wait-seconds=900`
  - `poll-interval-seconds=6`

## 3) 주요 옵션
- `--pr <number>`: PR 번호 직접 지정
- `--head <branch>`: PR 자동 탐색용 head 브랜치 지정
- `--no-wait`: 체크 미통과 시 즉시 실패
- `--auto-on-blocked`: 직접 머지 실패 시 `gh pr merge --auto`로 재시도
- `--admin`: `gh pr merge --admin` 전달
- `--dry-run`: 머지 없이 실행 계획만 출력

## 4) 비고
- 스크립트는 동일 head/base의 open PR을 우선 탐색한다.
- 정책상 self-approve가 필요한 경우는 자동으로 우회되지 않는다(리뷰 규칙은 별도 충족 필요).
