# PR 워크플로우 가이드 v1

## 1) 목적
- `main` 브랜치 직접 반영 대신 PR 기반으로 품질 게이트를 통과시키는 운영 표준을 정의한다.

## 2) 기본 원칙
1. 모든 개발은 작업 브랜치에서 수행한다.
2. `main` 병합 전 `verify-combat-diff` 체크를 반드시 통과한다.
3. PR 승인 1개 이상 후 병합한다.
4. 대화(코멘트) 미해결 상태에서는 병합하지 않는다.

## 3) 브랜치 규칙
- 권장 접두사: `codex/`
- 예시:
  - `codex/pr-workflow-foundation`
  - `codex/combat-ui-slice-v1`

## 4) 로컬 작업 순서
```bash
cd /Users/hirediversity/Idle
git checkout -b codex/<task-name>

# 개발
npm run typecheck
npm run combat:diff:py-ts:suite

git add .
git commit -m "<type>: <summary>"
git push -u origin codex/<task-name>
```

## 5) PR 생성 순서
```bash
gh pr create \
  --base main \
  --head codex/<task-name> \
  --title "<type>: <summary>" \
  --body-file /Users/hirediversity/Idle/.github/pull_request_template.md
```

## 6) 병합 체크
- Required check:
  - `verify-combat-diff`
- 리뷰:
  - 1명 이상 승인
- 정책:
  - stale review 자동 무효화
  - conversation 해결 필수

## 7) 관련 파일
- PR 템플릿: `/Users/hirediversity/Idle/.github/pull_request_template.md`
- 브랜치 보호 가이드: `/Users/hirediversity/Idle/docs/system/github_required_checks_v1_kr.md`
