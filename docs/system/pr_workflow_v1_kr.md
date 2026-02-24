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
npm run save:auto:regression:check
npm run save:offline:regression:check

git add .
git commit -m "<type>: <summary>"
git push -u origin codex/<task-name>
```

## 5) PR 생성 순서
```bash
npm run pr:body:gen -- --run-validation

gh pr create \
  --base main \
  --head codex/<task-name> \
  --title "<type>: <summary>" \
  --body-file /private/tmp/idle_pr_body_v1.md
```
- `pr:body:gen`은 변경 파일/커밋/검증 결과를 기반으로 `Summary/Changes/Validation/Docs/Notes`를 자동 작성한다.
- 이미 검증을 끝낸 경우에는 `--run-validation` 대신 `--validated` 옵션으로 체크 상태만 반영할 수 있다.
- 원클릭 흐름(본문 생성 + PR 생성/업데이트):
```bash
npm run pr:create:auto
```
- 기본값으로 `git push -u origin <head>`까지 포함해 원격 동기화 후 PR을 생성/업데이트한다.
- 본문 품질은 `lint_pr_body_v1.py` 단계에서 자동 점검된다.
- 머지 자동화(체크 대기 + squash 머지 + 브랜치 삭제):
```bash
npm run pr:merge:auto
```
- 승인 자동화(현재 브랜치 기준 PR approve 시도):
```bash
npm run pr:review:auto
```
- End-to-end 원클릭(본문 생성 + PR 생성/업데이트 + 체크 대기 + 머지):
```bash
npm run pr:ship:auto
```
- `pr:ship:auto`는 기본적으로 `생성/업데이트 -> 자동 승인(best-effort) -> 체크 대기/머지` 순서로 동작한다.

## 6) 병합 체크
- Required check:
  - `verify-combat-diff`
- 체크 표시 기준:
  - PR 화면에서는 `pull_request` 트리거 실행 1건이 주 체크로 표시된다.
  - `main` 머지 후에는 `push(main)` 기반 검증이 별도로 실행된다.
- PR 이벤트에서는 본문 품질 lint가 선행되며, 실패 시 나머지 검증 단계가 실행되지 않는다.
- CI 요약 확인:
  - `PR Body Lint` 섹션(pass/fail, 에러 개수)
  - `PR Validation Command Registry` 섹션(표준 Validation 명령의 package scripts 등록 상태)
  - `PR Required Check Coverage` 섹션(표준 Validation 명령과 Required Check 커버리지 결과)
  - `PR Validation Checklist Sync` 섹션(템플릿 Validation 동기화 결과)
  - `PR Body Lint Regression Summary` 섹션(케이스별 expected/result)
  - `PR Body Generator Regression Summary` 섹션(본문 생성기 회귀 케이스 결과)
  - `PR Validation Sync Regression Summary` 섹션(동기화 회귀 케이스 결과)
  - PR Checks의 Step Summary에서 저장 회귀 결과 테이블(`Auto Progress`/`Offline Catchup`) 확인
- PR 템플릿 Validation 항목 동기화는 `PR Validation Checklist Sync` step 성공 여부로 확인한다.
- 표준 Validation 명령의 package scripts 등록 상태는 `PR Validation Command Registry` step 성공 여부로 확인한다.
- Required Check가 표준 Validation 명령을 모두 포함하는지는 `PR Required Check Coverage` step 성공 여부로 확인한다.
- 모바일 수직슬라이스 동작 회귀 여부는 `Mobile MVP Slice Regression` step 성공 여부로 확인한다.
- PR 본문 lint 규칙 자체의 회귀 여부는 `PR Body Lint Regression` step 성공 여부로 확인한다.
- PR 본문 생성기 포맷 회귀 여부는 `PR Body Generator Regression` step 성공 여부로 확인한다.
- PR Validation 동기화 스크립트의 회귀 여부는 `PR Validation Sync Regression` step 성공 여부로 확인한다.
- 리뷰:
  - 1명 이상 승인
- 정책:
  - stale review 자동 무효화
  - conversation 해결 필수

## 7) 관련 파일
- PR 템플릿: `/Users/hirediversity/Idle/.github/pull_request_template.md`
- 브랜치 보호 가이드: `/Users/hirediversity/Idle/docs/system/github_required_checks_v1_kr.md`
- PR 본문 품질 Lint 가이드: `/Users/hirediversity/Idle/docs/system/pr_body_lint_v1_kr.md`
- PR 자동 승인 가이드: `/Users/hirediversity/Idle/docs/system/pr_review_auto_v1_kr.md`
- PR 자동 머지 가이드: `/Users/hirediversity/Idle/docs/system/pr_merge_auto_v1_kr.md`
- PR Validation 체크리스트 동기화 가이드: `/Users/hirediversity/Idle/docs/system/pr_validation_checklist_sync_v1_kr.md`
- PR Validation 명령 레지스트리 가이드: `/Users/hirediversity/Idle/docs/system/pr_validation_registry_v1_kr.md`
- PR Required Check 커버리지 가이드: `/Users/hirediversity/Idle/docs/system/pr_required_check_coverage_v1_kr.md`
- 모바일 MVP 수직슬라이스 가이드: `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`
- PR Validation 동기화 회귀 체크 가이드: `/Users/hirediversity/Idle/docs/system/pr_validation_sync_regression_v1_kr.md`
- PR 본문 생성기 회귀 체크 가이드: `/Users/hirediversity/Idle/docs/system/pr_body_generator_regression_v1_kr.md`
