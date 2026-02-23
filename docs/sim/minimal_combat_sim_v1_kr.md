# 최소 전투 시뮬레이션 덤프 v1

## 1) 파일
- 실행 스크립트: `/Users/hirediversity/Idle/scripts/simulate_minimal_combat_v1.py`
- 출력 JSON: `/Users/hirediversity/Idle/data/sim/minimal_combat_report_v1.json`
- 출력 CSV(요약): `/Users/hirediversity/Idle/data/sim/minimal_combat_summary_v1.csv`
- 출력 CSV(액션 로그): `/Users/hirediversity/Idle/data/sim/minimal_combat_action_log_v1.csv`

## 2) 실행
```bash
# 기본 시나리오
/Users/hirediversity/Idle/scripts/simulate_minimal_combat_v1.py

# 커스텀 시나리오 예시
/Users/hirediversity/Idle/scripts/simulate_minimal_combat_v1.py \
  --difficulty-index 26 \
  --player-level 36 \
  --rebirth-count 3 \
  --skill-id sk_atk_001 \
  --skill-id sk_atk_003 \
  --monster-id mob_m_002 \
  --monster-id mob_m_005 \
  --monster-id mob_m_012
```

## 3) 옵션
- `--difficulty-index`
- `--player-level`
- `--rebirth-count`
- `--seed`
- `--max-turns`
- `--skill-id`(반복 가능)
- `--monster-id`(반복 가능)
- `--no-action-log`

## 4) 출력 활용
1. `minimal_combat_summary_v1.csv`로 몹 유형별 승패/턴수 비교.
2. `minimal_combat_action_log_v1.csv`로 스킬 사용 주기/치명/미스 패턴 점검.
3. `minimal_combat_report_v1.json`으로 런타임 디버그 UI 샘플 데이터 공급.

## 5) 로그 컬럼 추가(v1.2)
- `element_multiplier`: 상성 보정 배율
- `applied_status`: 상태이상 시도 타입(`burn/slow/stun`)
- `status_applied`: 상태이상 실제 적용 여부
- `self_heal`: 행동 1회에서 회복한 체력(흡혈/회복 특수기 반영)

## 6) 반영된 몬스터 특수기(v1.2)
- on-hit 상태이상:
  - `burn_claw|burn_field|burn_stack|poison_stack` -> `burn`
  - `root_bind|frozen_prison|time_stop|chain_lightning|thunderstorm|judgment_mark|triple_tribulation` -> `stun`
  - `slow_aura|slow_field|charm_gaze` -> `slow`
  - `armor_break|time_cut` -> `armor_break`
  - `law_suppress|fear_aura` -> `weaken`
- 패시브 보정: `high_crit`, `high_def|adaptive_armor|law_barrier`, `shield_cast|invuln_phase`
- 조건부 보정: `blink_strike|multi_dash|phase_shift`(선공 배율), `execute_mark|soul_harvest|origin_tribulation`(처형 배율), `heal_link`(온히트 자가회복)

## 7) 검증 팁
- `self_heal` 값 변화를 확인하려면 `heal_link` 몬스터를 포함해 실행:
```bash
/Users/hirediversity/Idle/scripts/simulate_minimal_combat_v1.py \
  --monster-id mob_i_008 \
  --monster-id mob_m_003 \
  --monster-id mob_m_008
```

## 8) TS/PY 결과 비교
- 교차 검증 문서: `/Users/hirediversity/Idle/docs/sim/minimal_combat_ts_py_diff_v1_kr.md`
- 실행 명령:
```bash
cd /Users/hirediversity/Idle
npm run combat:diff:py-ts
npm run combat:diff:py-ts:suite
```
- 현재는 TS/PY RNG 및 반올림 규칙이 통일되어 기본 시나리오에서 결과가 1:1로 정합되도록 유지한다.
