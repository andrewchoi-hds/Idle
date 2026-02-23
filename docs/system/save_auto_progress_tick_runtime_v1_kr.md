# Save v2 자동 진행 틱 루프 v1

기준 시점: 2026-02-23  
대상 파일:
- `/Users/hirediversity/Idle/src/progression/saveAutoProgressLoop.ts`
- `/Users/hirediversity/Idle/scripts/dump_save_auto_progress_tick_ts_v1.ts`

## 1) 목적
- `save_v2`를 기준으로 `수련 -> 자동전투 -> 돌파/도겁`을 시간축에서 연속 실행한다.
- 1분/10분 단위 시뮬레이션으로 성장량, 재화 흐름, 돌파 결과를 빠르게 검증한다.

## 2) 핵심 API
- `runSaveAutoProgressLoop(tables, indexes, save, input)`
  - 입력:
    - `durationSec`, `tickSec`
    - `battleIntervalSec`, `breakthroughCheckIntervalSec`
    - `statusPenaltyPct`, `defensiveSkillGuardPct`
    - `breakthroughConsumableItemIds`, `tribulationConsumableItemIds`
  - 출력:
    - `save`(틱 종료 시점 저장 상태)
    - `summary`(전투/돌파/재화/환생 집계)
    - `eventLogs`(battle/breakthrough/rebirth 이벤트)
    - `warnings`

## 3) 루프 동작
1. 매 tick마다 현재 경지 기준 수련 기력(`qi`) 증가.
2. `auto_battle=true`일 때 배틀 간격 도달 시 최소 전투 루프 1회 실행.
3. 배틀 결과에 따라 `spirit_coin`, `rebirth_essence`, `qi`를 증감.
4. 돌파 체크 간격 도달 시 `qi_required` 충족 + 자동옵션 켜짐이면 돌파 시도.
5. `death_fail` 발생 시 기존 환생 정산 규칙(리셋+보상)을 그대로 적용.

## 4) 실행 명령
기본 10분 시뮬레이션:
```bash
cd /Users/hirediversity/Idle
npm run save:auto:tick:ts
```

자동 돌파 켜고 10분 시뮬레이션:
```bash
npm run save:auto:tick:ts -- \
  --duration-sec 600 \
  --enable-auto-breakthrough \
  --override-difficulty-index 42 \
  --override-qi 700000
```

도겁 구간 1분 시뮬레이션:
```bash
npm run save:auto:tick:ts -- \
  --duration-sec 60 \
  --enable-auto-breakthrough \
  --enable-auto-tribulation \
  --override-difficulty-index 198 \
  --override-qi 3071153581 \
  --seed 2688
```

출력 파일:
- `/Users/hirediversity/Idle/data/sim/save_v2_auto_progress_tick_ts_v1.json`

## 5) 샘플 결과(10분, diff=42)
- 종료 경지: `44`(인간계 원영 5층)
- 돌파 시도: `2`회, 성공 `2`회
- 전투: `65`전 `65`승
- 재화 변화:
  - `spirit_coin +71621`
  - `rebirth_essence +419`
  - `qi -317829` (돌파 소모 포함 순변화)

## 6) 비고
- 전투는 `runMinimalCombatLoop`를 1전 단위로 호출하므로 규칙 정합성이 유지된다.
- 로그는 `maxEventLogs` 제한을 넘기면 추가 저장하지 않는다.
- 경고 문자열은 중복 제거 후 반환된다.

## 7) 회귀 체크
- 시나리오 파일: `/Users/hirediversity/Idle/data/sim/save_auto_progress_regression_scenarios_v1.json`
- 점검 스크립트: `/Users/hirediversity/Idle/scripts/check_save_auto_progress_regression_v1.py`
- 실행 명령:
```bash
cd /Users/hirediversity/Idle
npm run save:auto:regression:check
```
- 회귀 점검은 시나리오별 임시 출력 파일을 사용하므로, 샘플 파일(`/Users/hirediversity/Idle/data/sim/save_v2_auto_progress_tick_ts_v1.json`)을 덮어쓰지 않는다.
- CI(`verify-combat-diff`)에서도 동일 회귀 체크를 실행해 자동 진행 루프 수치 변경을 감지한다.
