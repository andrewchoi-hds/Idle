# 돌파/도겁 런타임 엔진 가이드 v1

기준 시점: 2026-02-23  
대상 파일:
- `/Users/hirediversity/Idle/src/progression/tribulationEngine.ts`
- `/Users/hirediversity/Idle/scripts/dump_tribulation_trials_ts_v1.ts`

## 1) 목적
- 경지별 돌파 시도 결과를 런타임에서 직접 판정한다.
- 도겁 구간 실패 시 `경미/퇴보/사망` 분기를 가중치 테이블로 처리한다.
- 환생 업그레이드/영약/부적/연속 실패 보정을 공식에 반영한다.

## 2) 입력 데이터 연동
- 경지 기본값: `/Users/hirediversity/Idle/data/export/realm_progression_v1.json`
  - `base_breakthrough_success_pct`, `is_tribulation`, `base_death_pct`, `fail_retreat_min/max`
- 도겁 실패 가중치: `/Users/hirediversity/Idle/data/export/tribulation_failure_weights_v1.json`
- 환생 업그레이드: `/Users/hirediversity/Idle/data/export/rebirth_upgrades_v1.json`
  - `breakthrough_bonus`, `tribulation_guard`, `potion_mastery`
- 영약/부적: `/Users/hirediversity/Idle/data/export/potions_talismans_v1.json`
  - `breakthrough_bonus_flat_pct`, `tribulation_death_reduce_flat_pct`

## 3) 핵심 API
1. `evaluateBreakthroughAttempt(tables, indexes, input)`
- 단일 돌파/도겁 시도 1회 판정.
- 결과:
  - `outcome`: `blocked_no_qi | success | minor_fail | retreat_fail | death_fail`
  - `rates.successPct`, `rates.deathPct`
  - `rates.failureWeights`(도겁 시에만)
  - `nextDifficultyIndex`, `qiDelta`, `retreatLayers`
  - 적용 보너스 분해(`breakdown`, `consumables`, `warnings`)

2. `runBreakthroughTrials(tables, indexes, input)`
- 동일 조건 다회 시뮬레이션 집계.
- 결과:
  - 결과별 count/rate
  - 평균 퇴보 층 수
  - 평균 기력 변화량
  - 샘플 1회 상세 결과

## 4) 공식 반영 방식
1. 돌파 성공률
```text
clamp(5, 95,
  base_breakthrough_success_pct
  + rebirth(breakthrough_bonus)
  + consumable(breakthrough_bonus_flat_pct)
  + fail_streak_bonus
  - status_penalty
)
```

2. 도겁 사망률
```text
clamp(0, 90,
  base_death_pct
  - rebirth(tribulation_guard)
  - consumable(tribulation_death_reduce_flat_pct)
  - defensive_skill_guard
)
```

3. 도겁 실패 3분기
- `deathPct`는 실패 분기 내 사망 비중으로 사용.
- `minor/retreat`는 가중치 CSV 비율을 유지한 채 `100 - deathPct`로 재정규화.
- 가중치가 없으면 fallback(`minor=100-deathPct`, `retreat=0`) 적용.

## 5) 실행 명령
기본 샘플(인간/신선/진선 대표 난이도):
```bash
cd /Users/hirediversity/Idle
npm run tribulation:dump:ts
```

커스텀 샘플:
```bash
npm run tribulation:dump:ts -- \
  --difficulty-index 117 \
  --trials 10000 \
  --fail-streak 3 \
  --rebirth-breakthrough-level 8 \
  --rebirth-guard-level 8 \
  --rebirth-potion-level 6 \
  --consumable pot_brk_03 \
  --consumable pot_tri_02 \
  --consumable tal_guard_02
```

출력 파일:
- `/Users/hirediversity/Idle/data/sim/tribulation_trials_ts_v1.json`

## 6) 비고
- 난수는 `xorshift32`(`SeededRng`)를 사용해 재현 가능하다.
- `currentQi`가 `qi_required` 미만이면 `blocked_no_qi`를 반환해 자동돌파 조건과 바로 연결 가능하다.
- `potion_mastery`는 영약(`item_type=potion`) 효과에만 배율로 적용된다.
