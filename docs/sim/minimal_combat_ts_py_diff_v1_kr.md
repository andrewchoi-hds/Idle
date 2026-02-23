# 최소 전투 TS/PY Diff v1

## 1) 목적
- TypeScript 전투 루프(`/Users/hirediversity/Idle/src/combat/minimalCombatLoop.ts`)와
  Python 시뮬레이터(`/Users/hirediversity/Idle/scripts/simulate_minimal_combat_v1.py`)의
  결과가 허용 오차 내에서 일치하는지 자동 점검한다.

## 2) 파일
- TS 리포트 덤프: `/Users/hirediversity/Idle/scripts/dump_minimal_combat_ts_v1.ts`
- TS/PY 비교기: `/Users/hirediversity/Idle/scripts/compare_minimal_combat_ts_py_v1.py`
- TS 출력 JSON: `/Users/hirediversity/Idle/data/sim/minimal_combat_report_ts_v1.json`
- PY 출력 JSON: `/Users/hirediversity/Idle/data/sim/minimal_combat_report_v1.json`

## 3) 실행
```bash
cd /Users/hirediversity/Idle
npm run combat:diff:py-ts

# 다중 시나리오(인간계/신선계/진선계) 스위트
npm run combat:diff:py-ts:suite
```

## 4) 비교 규칙(기본)
- 설정 값은 완전 일치해야 함:
  - `difficulty_index`, `player_level`, `rebirth_count`, `seed`, `max_turns`
  - `skill_ids`, `monster_ids`
- 듀얼별 `winner`는 일치해야 함.
- 허용 오차(기본):
  - `win_rate` delta <= `0.000001`
  - duel `turns` delta <= `0.0`
  - duel `elapsed_sec` delta <= `0.0005`
  - duel `player_hp_left` delta <= `0.01`
  - duel `monster_hp_left` delta <= `0.01`

## 5) 커스텀 실행 예시
```bash
/Users/hirediversity/Idle/scripts/compare_minimal_combat_ts_py_v1.py \
  --difficulty-index 26 \
  --player-level 36 \
  --rebirth-count 3 \
  --skill-id sk_atk_001 \
  --skill-id sk_atk_003 \
  --monster-id mob_m_002 \
  --monster-id mob_m_005 \
  --monster-id mob_m_012 \
  --max-turn-delta 5 \
  --max-elapsed-delta 2.0
```

## 6) 참고
- TS/PY 모두 `xorshift32` 기반 시드 RNG를 사용한다.
- 반올림도 JS `Math.round`/`toFixed`와 맞춘 규칙으로 통일되어 기본 시나리오에서 사실상 동일 수치를 기대할 수 있다.

## 7) CI 연동
- 워크플로우: `/Users/hirediversity/Idle/.github/workflows/combat-diff-ci.yml`
- 트리거: `pull_request`, `push`, `workflow_dispatch`
- 실행 순서:
  - `npm ci`
  - `npm run typecheck`
  - `npm run combat:diff:py-ts:suite`

## 8) 시나리오 세트
- 기본 스위트 파일: `/Users/hirediversity/Idle/data/sim/combat_diff_scenarios_v1.json`
- 포함 시나리오:
  - `mortal_baseline`
  - `immortal_midgame`
  - `true_realm_entry`

## 9) 시나리오 파일 형식
- 최상위 `scenarios` 배열(또는 배열 직접)을 사용한다.
- 각 항목 필드:
  - `name`
  - `difficulty_index`, `player_level`, `rebirth_count`, `seed`, `max_turns`
  - `skill_ids`, `monster_ids`
  - `include_action_log`
