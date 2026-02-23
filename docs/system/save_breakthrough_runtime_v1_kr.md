# Save v2 돌파/도겁 런타임 연동 v1

기준 시점: 2026-02-23  
대상 파일:
- `/Users/hirediversity/Idle/src/progression/saveBreakthroughRuntime.ts`
- `/Users/hirediversity/Idle/scripts/dump_save_breakthrough_step_ts_v1.ts`

## 1) 목적
- `save_v2` 상태에서 자동 돌파/자동 도겁 옵션을 직접 판정해 경지를 진행한다.
- `pity_counters`를 성공/실패 결과에 맞게 갱신한다.
- 소모품(영약/부적)을 인벤토리 수량과 연동해 소비한다.

## 2) 핵심 API
- `applyBreakthroughStepToSaveV2(tables, indexes, save, options)`
  - 입력: `SaveV2`, RNG seed, 소모품 ID 목록, 상태 패널티/보호치
  - 처리:
    1. 현재 `difficulty_index` 경지의 돌파/도겁 여부 확인
    2. `settings.auto_breakthrough`, `settings.auto_tribulation` 조건 확인
    3. `evaluateBreakthroughAttempt` 호출
    4. `save.progression`, `save.currencies.qi`, `save.pity_counters` 반영
    5. 시도 시 소모품 수량 차감
    6. `validateSaveV2` 재검증
  - 출력:
    - 시도 결과(`attemptResult`)
    - 전/후 경지(`stageBefore`, `stageAfter`)
    - 소비 아이템 카운트(`consumedItemCounts`)
    - 경고 목록(`warnings`)

## 3) pity 적용 규칙
- 비도겁 구간:
  - 성공: `breakthrough_fail_streak = 0`
  - 실패: `breakthrough_fail_streak += 1`
- 도겁 구간:
  - 성공: `tribulation_fail_streak = 0`
  - 실패(경미/퇴보/사망): `tribulation_fail_streak += 1`
  - 사망 시 `rebirth_count += 1`, `breakthrough_fail_streak = 0`

## 4) 자동 옵션 적용 규칙
- 도겁이 아닌 구간에서 `auto_breakthrough=false`면 스킵.
- 도겁 구간에서 `auto_tribulation=false`면 스킵.
- `forceAttempt=true`면 옵션 무시하고 강제 시도.

## 5) 실행 스크립트
기본:
```bash
cd /Users/hirediversity/Idle
npm run save:breakthrough:dump:ts
```

강제 시도 + 소모품:
```bash
npm run save:breakthrough:dump:ts -- \
  --force-attempt \
  --consumable pot_brk_02 \
  --consumable tal_guard_01
```

출력:
- `/Users/hirediversity/Idle/data/sim/save_v2_breakthrough_step_ts_v1.json`

## 6) 비고
- rebirth 업그레이드 레벨은 기본적으로 `rebirth_count`에서 추정해 사용한다.
- 정확한 업그레이드 상태가 서버/메타 저장소에 있으면 `options.rebirthLevels`로 덮어쓰는 것을 권장한다.
