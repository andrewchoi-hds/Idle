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
```

## 주요 파일
- 전투 루프(TS): `/Users/hirediversity/Idle/src/combat/minimalCombatLoop.ts`
- 전투 시뮬레이터(PY): `/Users/hirediversity/Idle/scripts/simulate_minimal_combat_v1.py`
- TS/PY diff 스크립트: `/Users/hirediversity/Idle/scripts/compare_minimal_combat_ts_py_v1.py`
- 다중 시나리오 세트: `/Users/hirediversity/Idle/data/sim/combat_diff_scenarios_v1.json`
- CI 워크플로우: `/Users/hirediversity/Idle/.github/workflows/combat-diff-ci.yml`

## 운영 문서
- 전투 diff 가이드: `/Users/hirediversity/Idle/docs/sim/minimal_combat_ts_py_diff_v1_kr.md`
- Required Check 설정 가이드: `/Users/hirediversity/Idle/docs/system/github_required_checks_v1_kr.md`
- PR 워크플로우 가이드: `/Users/hirediversity/Idle/docs/system/pr_workflow_v1_kr.md`
