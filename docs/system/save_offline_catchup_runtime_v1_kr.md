# Save v2 오프라인 복귀 정산 런타임 v1

기준 시점: 2026-02-23  
대상 파일:
- `/Users/hirediversity/Idle/src/progression/saveOfflineCatchupRuntime.ts`
- `/Users/hirediversity/Idle/scripts/dump_save_offline_catchup_ts_v1.ts`

## 1) 목적
- 모바일 환경에서 앱 재진입 시, 오프라인 경과 시간을 한 번에 정산한다.
- 무한 누적을 막기 위해 `offline_reward_hours_cap`(기본 12시간)을 적용한다.

## 2) 핵심 API
- `runSaveOfflineCatchupRuntime(tables, indexes, save, input)`
  - 오프라인 기준 시각:
    - 기본: `max(save.timestamps.last_login_epoch_ms, save.timestamps.save_epoch_ms)`
    - 옵션: `anchorEpochMs`로 강제 지정 가능
  - 현재 시각:
    - 기본: `Date.now()`
    - 옵션: `nowEpochMs`
  - 정산 시간:
    - `rawOfflineSec = floor((now - anchor) / 1000)`
    - `appliedOfflineSec = min(rawOfflineSec, offline_reward_hours_cap * 3600)`
  - 적용:
    - `appliedOfflineSec > 0`이면 내부적으로 `runSaveAutoProgressLoop`를 호출해 수련/전투/돌파/도겁을 진행
  - 타임스탬프:
    - 기본 `syncTimestampsToNow=true`: 정산 후 `last_login_epoch_ms`, `save_epoch_ms`를 현재 시각으로 동기화

## 3) 실행 명령
```bash
cd /Users/hirediversity/Idle
npm run save:offline:catchup:ts -- \
  --now-epoch-ms 1771894800000 \
  --enable-auto-breakthrough \
  --tick-sec 5
```

출력 파일:
- `/Users/hirediversity/Idle/data/sim/save_v2_offline_catchup_ts_v1.json`

## 4) 주요 출력 필드
- `summary.rawOfflineSec`: 실제 경과 시간(초)
- `summary.maxOfflineSec`: 캡 적용 한도(초)
- `summary.appliedOfflineSec`: 실제 정산에 적용된 시간(초)
- `summary.cappedByMaxOffline`: 캡 적용 여부
- `summary.autoProgressSummary`: 내부 자동 진행 요약(`null` 가능)

## 5) 비고
- 오프라인 시간이 캡을 초과하면 경고 문자열에 캡 정보가 기록된다.
- 디바이스 시계 역행이 감지되면 타임스탬프는 역행하지 않도록 큰 값 기준으로 동기화하고 경고를 남긴다.
- `--keep-timestamps`를 주면 정산 후 타임스탬프 동기화를 생략할 수 있다(디버그 용도).

## 6) 회귀 체크
- 시나리오 파일: `/Users/hirediversity/Idle/data/sim/save_offline_catchup_regression_scenarios_v1.json`
- 점검 스크립트: `/Users/hirediversity/Idle/scripts/check_save_offline_catchup_regression_v1.py`
- 실행 명령:
```bash
cd /Users/hirediversity/Idle
npm run save:offline:regression:check
```
- JSON 리포트 생성:
```bash
npm run save:offline:regression:check:report
```
- 두 회귀 리포트 통합 Markdown 요약 생성:
```bash
npm run save:regression:summary:md
```
- CI(`verify-combat-diff`)에서도 동일 회귀 체크를 실행해 오프라인 정산 수치 변경을 감지한다.
