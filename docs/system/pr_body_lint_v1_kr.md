# PR 본문 품질 Lint 가이드 v1

기준 시점: 2026-02-23  
대상 파일:
- `/Users/hirediversity/Idle/scripts/lint_pr_body_v1.py`

## 1) 목적
- PR 본문이 템플릿 수준(`-`)으로 비어 올라가는 실수를 사전에 차단한다.
- 자동 생성 본문의 최소 품질(섹션/체크리스트/노트)을 merge 전 강제한다.

## 2) 기본 실행
```bash
cd /Users/hirediversity/Idle
npm run pr:body:gen
npm run pr:body:lint
```
- 기본 입력: `/private/tmp/idle_pr_body_v1.md`

## 3) 점검 항목
- `## Summary/Changes/Validation/Docs/Notes` 5개 섹션 존재
- Summary: 의미 있는 bullet 3개 이상
- Changes: 의미 있는 bullet 1개 이상(옵션 시 절대 경로 bullet 포함)
- Validation: 표준 검증 4개 커맨드 체크박스 존재
- Docs: 체크리스트 bullet 2개 이상
- Notes: `Generated at`, `Diff range` 존재

## 4) create/ship 자동 연계
- `pr:create:auto`는 본문 생성 후 lint를 기본 실행한다.
- `pr:ship:auto`도 create 단계를 통해 동일한 lint를 기본 실행한다.
- 임시 우회가 필요하면 `--no-body-lint` 옵션을 사용한다.
