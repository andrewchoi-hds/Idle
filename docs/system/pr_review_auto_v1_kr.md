# PR 자동 승인 가이드 v1

기준 시점: 2026-02-23  
대상 파일:
- `/Users/hirediversity/Idle/scripts/review_pr_auto_v1.py`

## 1) 목적
- PR 생성 후 승인 클릭 누락을 줄이기 위해 승인 단계를 커맨드화한다.
- 원클릭 ship 흐름에서 승인 시도를 선행해 머지 전 대기 시간을 줄인다.

## 2) 기본 실행
```bash
cd /Users/hirediversity/Idle
npm run pr:review:auto
```
- 기본 동작: 현재 브랜치 기준으로 `main` 대상 open PR을 찾아 `gh pr review --approve` 실행.

## 3) 주요 옵션
- `--pr <number>`: 브랜치 탐색 대신 특정 PR 번호 지정
- `--head <branch>`: 대상 head 브랜치 명시
- `--body "<text>"`: 승인 코멘트 변경
- `--require-success`: 승인 실패를 허용하지 않고 즉시 실패 처리
- `--dry-run`: 대상 PR만 출력하고 승인은 실행하지 않음

## 4) 비고
- 자기 PR self-approve 제한 등으로 승인 실패가 발생할 수 있다.
- 기본값은 best-effort 모드이므로 승인 실패 시 경고만 출력하고 종료 코드 0으로 반환한다.
- 승인 실패도 파이프라인 실패로 간주하려면 `--require-success`를 사용한다.
