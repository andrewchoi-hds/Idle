# PR 본문 자동 생성기 v1

기준 시점: 2026-02-23  
대상 파일:
- `/Users/hirediversity/Idle/scripts/generate_pr_body_v1.py`

## 1) 목적
- PR 작성 시 템플릿 빈칸(`-`)이 그대로 올라가는 문제를 줄인다.
- `git diff`/커밋/검증 결과를 이용해 `Summary/Changes/Validation/Docs/Notes`를 자동으로 채운다.
- Summary에 변경 규모(`files/commits/+add/-del`)를 추가해 리뷰 스코프를 빠르게 파악한다.
- Changes/Notes에 파일별 변경량 및 커밋 해시를 포함해 추적성을 높인다.

## 2) 기본 실행
```bash
cd /Users/hirediversity/Idle
npm run pr:body:gen
```
- 출력: `/private/tmp/idle_pr_body_v1.md`
- 기본 비교 범위: `origin/main..HEAD`

## 3) 검증까지 같이 실행
```bash
npm run pr:body:gen -- --run-validation
```
- 다음 검증 명령을 순서대로 실행 후 체크박스를 반영한다.
  - `npm run typecheck`
  - `npm run combat:diff:py-ts:suite`
  - `npm run save:auto:regression:check`
  - `npm run save:offline:regression:check`
  - `npm run pr:validation:sync:check`
  - `npm run pr:body:lint:regression:check`

## 4) PR 생성 연계
```bash
gh pr create \
  --base main \
  --head codex/<task-name> \
  --title "<type>: <summary>" \
  --body-file /private/tmp/idle_pr_body_v1.md
```

## 5) 비고
- `--run-validation` 미사용 시 Validation 체크박스는 기본 미체크 상태다.
- 필요 시 `--validated "<command>"`를 반복 전달해 체크 상태를 수동 지정할 수 있다.
- 본문 품질 점검은 `npm run pr:body:lint`로 별도 수행할 수 있다.
- `Changes` 항목은 `git diff --numstat` 기준의 `(+add/-del)` 정보를 함께 출력한다.
- Validation 표준 명령 목록은 `/Users/hirediversity/Idle/scripts/pr_validation_commands_v1.py`를 단일 소스로 사용한다.
