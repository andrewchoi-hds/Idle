# Idle Xianxia Prototype

방치형 선협풍 도트 게임 프로토타입 저장소다.  
현재는 밸런스 데이터 파이프라인 + 최소 전투 루프(TS/PY) + 교차 검증 CI를 중심으로 운영한다.

## CI Status
[![Combat Diff CI](https://github.com/andrewchoi-hds/Idle/actions/workflows/combat-diff-ci.yml/badge.svg)](https://github.com/andrewchoi-hds/Idle/actions/workflows/combat-diff-ci.yml)

## 핵심 검증 명령
```bash
cd /Users/hirediversity/Idle
npm run typecheck
npm run combat:diff:py-ts
npm run combat:diff:py-ts:suite
npm run tribulation:dump:ts
npm run save:breakthrough:dump:ts
npm run save:auto:tick:ts
npm run save:offline:catchup:ts
npm run save:auto:regression:check
npm run save:offline:regression:check
npm run save:regression:summary:md
npm run pr:body:gen
npm run pr:body:lint
npm run pr:body:lint:regression:check
npm run pr:create:auto
npm run pr:review:auto
npm run pr:merge:auto
npm run pr:ship:auto
```

## 주요 파일
- 전투 루프(TS): `/Users/hirediversity/Idle/src/combat/minimalCombatLoop.ts`
- 돌파/도겁 엔진(TS): `/Users/hirediversity/Idle/src/progression/tribulationEngine.ts`
- 전투 시뮬레이터(PY): `/Users/hirediversity/Idle/scripts/simulate_minimal_combat_v1.py`
- TS/PY diff 스크립트: `/Users/hirediversity/Idle/scripts/compare_minimal_combat_ts_py_v1.py`
- 다중 시나리오 세트: `/Users/hirediversity/Idle/data/sim/combat_diff_scenarios_v1.json`
- 도겁 시뮬레이션 덤프(TS): `/Users/hirediversity/Idle/scripts/dump_tribulation_trials_ts_v1.ts`
- save_v2 돌파 스텝 덤프(TS): `/Users/hirediversity/Idle/scripts/dump_save_breakthrough_step_ts_v1.ts`
- save_v2 자동 진행 틱 덤프(TS): `/Users/hirediversity/Idle/scripts/dump_save_auto_progress_tick_ts_v1.ts`
- save_v2 오프라인 복귀 정산 덤프(TS): `/Users/hirediversity/Idle/scripts/dump_save_offline_catchup_ts_v1.ts`
- 저장 회귀 CI 요약 빌더(PY): `/Users/hirediversity/Idle/scripts/build_save_regression_ci_summary_v1.py`
- PR 본문 자동 생성기(PY): `/Users/hirediversity/Idle/scripts/generate_pr_body_v1.py`
- PR 본문 품질 Lint(PY): `/Users/hirediversity/Idle/scripts/lint_pr_body_v1.py`
- PR 본문 Lint 회귀 체크(PY): `/Users/hirediversity/Idle/scripts/check_pr_body_lint_regression_v1.py`
- PR 자동 생성/업데이트(PY): `/Users/hirediversity/Idle/scripts/create_pr_with_body_v1.py`
- PR 자동 승인(PY): `/Users/hirediversity/Idle/scripts/review_pr_auto_v1.py`
- PR 체크대기 자동 머지(PY): `/Users/hirediversity/Idle/scripts/merge_pr_when_ready_v1.py`
- PR 원클릭 ship 자동화(PY): `/Users/hirediversity/Idle/scripts/ship_pr_auto_v1.py`
- CI 워크플로우: `/Users/hirediversity/Idle/.github/workflows/combat-diff-ci.yml`

## 운영 문서
- 전투 diff 가이드: `/Users/hirediversity/Idle/docs/sim/minimal_combat_ts_py_diff_v1_kr.md`
- Required Check 설정 가이드: `/Users/hirediversity/Idle/docs/system/github_required_checks_v1_kr.md`
- PR 워크플로우 가이드: `/Users/hirediversity/Idle/docs/system/pr_workflow_v1_kr.md`
- PR 본문 자동 생성 가이드: `/Users/hirediversity/Idle/docs/system/pr_body_generator_v1_kr.md`
- PR 본문 품질 Lint 가이드: `/Users/hirediversity/Idle/docs/system/pr_body_lint_v1_kr.md`
- PR 본문 Lint 회귀 체크 가이드: `/Users/hirediversity/Idle/docs/system/pr_body_lint_regression_v1_kr.md`
- PR 자동 생성/업데이트 가이드: `/Users/hirediversity/Idle/docs/system/pr_create_auto_v1_kr.md`
- PR 자동 승인 가이드: `/Users/hirediversity/Idle/docs/system/pr_review_auto_v1_kr.md`
- PR 자동 머지 가이드: `/Users/hirediversity/Idle/docs/system/pr_merge_auto_v1_kr.md`
- PR 원클릭 ship 가이드: `/Users/hirediversity/Idle/docs/system/pr_ship_auto_v1_kr.md`
- 도겁 런타임 가이드: `/Users/hirediversity/Idle/docs/system/tribulation_runtime_v1_kr.md`
- save_v2 돌파 런타임 가이드: `/Users/hirediversity/Idle/docs/system/save_breakthrough_runtime_v1_kr.md`
- save_v2 자동 진행 루프 가이드: `/Users/hirediversity/Idle/docs/system/save_auto_progress_tick_runtime_v1_kr.md`
- save_v2 오프라인 복귀 정산 가이드: `/Users/hirediversity/Idle/docs/system/save_offline_catchup_runtime_v1_kr.md`
