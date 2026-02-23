# MVP 전투 최소 루프 v1

## 1) 파일
- 전투 루프: `/Users/hirediversity/Idle/src/combat/minimalCombatLoop.ts`
- 의존 로더: `/Users/hirediversity/Idle/src/balance/balanceLoader.ts`
- 덤프 스크립트: `/Users/hirediversity/Idle/scripts/simulate_minimal_combat_v1.py`

## 2) 목표
- 플레이어 1명 vs 몹 3종(일반/정예/보스) 듀얼 시뮬레이션.
- 스킬 2개(기본값: `sk_atk_001`, `sk_atk_002`) 쿨다운/MP를 반영.
- 결과 요약(`winRate`, 평균 턴/시간)과 액션 로그를 생성.
- 속성 상성(`화-풍-토-뇌-빙` 순환)과 상태이상(`burn/slow/stun`)을 반영.
- 몹 `special_mechanic` 기반 패시브/온히트 효과를 반영.

## 3) 기본 시나리오
- 난이도: `difficultyIndex=20`
- 플레이어 레벨: `30`
- 환생 횟수: `2`
- 몹: `mob_m_001`, `mob_m_003`, `mob_m_008`
- 최대 턴: `180`

## 4) 주요 API
- `runMinimalCombatLoop(tables, indexes, config?)`
- `formatMinimalCombatReport(report)`

## 5) 사용 예시
```ts
import {
  loadBalanceTables,
  buildBalanceIndexes,
} from "/Users/hirediversity/Idle/src/balance/balanceLoader";
import {
  runMinimalCombatLoop,
  formatMinimalCombatReport,
} from "/Users/hirediversity/Idle/src/combat/minimalCombatLoop";

const tables = await loadBalanceTables();
const indexes = buildBalanceIndexes(tables);

const report = runMinimalCombatLoop(tables, indexes, {
  difficultyIndex: 20,
  playerLevel: 30,
  rebirthCount: 2,
  rngSeed: 20260223,
});

console.log(formatMinimalCombatReport(report));
```

## 6) 메모
- 현재는 MVP 프로토타입이며, 광역 타게팅/도겁 특수룰은 단순화되어 있다.
- 상성 규칙: `fire > wind > earth > thunder > ice > fire`, 그 외 속성은 `none`(중립) 처리.
- 로그를 끄려면 `includeActionLogs: false` 사용.
- 액션 로그는 `selfHeal`(이번 행동으로 회복한 체력) 필드를 포함한다.

## 7) special_mechanic 매핑(현재)
- on-hit 상태이상
  - `burn_claw|burn_field|burn_stack|poison_stack` -> `burn`
  - `root_bind|frozen_prison|time_stop|chain_lightning|thunderstorm|judgment_mark|triple_tribulation` -> `stun`
  - `slow_aura|slow_field|charm_gaze` -> `slow`
  - `armor_break|time_cut` -> `armor_break`(피격자 방어 배율 0.8)
  - `law_suppress|fear_aura` -> `weaken`(피격자 공격 배율 0.85)
- 패시브 보정
  - `high_crit` -> 치명 확률 +0.08
  - `high_def|adaptive_armor|law_barrier` -> 방어/피해감소 증가
  - `shield_cast|invuln_phase` -> 피해감소 증가
- 조건부 보정
  - `blink_strike|multi_dash|phase_shift` -> 몬스터 첫 공격 계수 배율 적용
  - `execute_mark|soul_harvest|origin_tribulation` -> 대상 HP 비율 조건부 처형 배율
  - `heal_link` -> 명중 피해 기반 자가 회복

## 8) 시뮬레이션 덤프
- 상세 문서: `/Users/hirediversity/Idle/docs/sim/minimal_combat_sim_v1_kr.md`
