# 선협풍 환생형 방치 게임 상세 설계 v0.3

## 1) 목표
- 장르: 선협풍 도트 기반 환생형 방치 RPG.
- 코어 재미: 성장 -> 돌파 -> 도겁(리스크) -> 사망/환생 -> 메타 강화 -> 재도전.
- 기준: 한 생애 성취와 환생 누적 성장을 동시에 보상한다.

## 2) 경지 시스템

### 2.1 구조
- 인간계: 8단계, 각 단계는 `1층~12층 + 대원만`.
- 신선계: 6단계, 각 단계는 `1층~12층 + 대원만`.
- 진선계: 4단계, 각 단계는 `초입/안정/완성/원만`.
- 전체 구간 수: `198`.

### 2.2 데이터 파일
- 경지 테이블: `/Users/hirediversity/Idle/data/progression/realm_progression_v1.csv`
- 경지 한글 매핑: `/Users/hirediversity/Idle/data/progression/realm_locale_ko_v1.csv`
- 컬럼 핵심:
  - `world`, `major_stage_name`, `sub_stage_name`
  - `qi_required`
  - `base_breakthrough_success_pct`
  - `is_tribulation`, `base_death_pct`
  - `fail_retreat_min`, `fail_retreat_max`

### 2.3 돌파/도겁 공식
```text
최종돌파성공률 = clamp(5, 95,
  base_breakthrough_success_pct
  + 환생보너스
  + 영약보너스
  + 부적보너스
  + 연속실패보정
  - 상태이상패널티
)

최종사망확률(도겁시에만) = clamp(0, 90,
  base_death_pct
  - 환생보호
  - 영약보호
  - 부적보호
  - 방어형스킬보호
)
```

### 2.4 도겁 실패 결과
- 경미 실패: 재료/기력 손실.
- 퇴보 실패: `fail_retreat_min~max` 범위 층 하락.
- 치명 실패: 사망 후 환생.
- 가중치 테이블: `/Users/hirediversity/Idle/data/balance/tribulation_failure_weights_v1.csv`

## 3) 전투 시스템

### 3.1 전투 루프
- 탐색 -> 조우 -> 자동 스킬 순환 -> 승패 -> 보상.
- 틱 간격: 0.2초.

### 3.2 계산
```text
최종공격력 = (기본공격 + 장비공격) * (1 + 공격증폭%)
방어감쇠 = 방어 / (방어 + K)
최종피해 = 최종공격력 * 스킬계수 * (1 - 방어감쇠) * 속성보정 * 치명보정
```
- 상수 파일: `/Users/hirediversity/Idle/data/balance/combat_constants_v1.csv`
- 기본 K 값: `180`.

### 3.3 전투 시간 목표
- 일반: 5~12초.
- 정예: 20~40초.
- 보스: 60~180초.

## 4) 환생 시스템

### 4.1 환생 트리거
- 사망 시 강제 환생.
- 수동 환생 가능(최저 조건 도달 시).

### 4.2 환생 재화
- 윤회정수(기본).
- 천명조각(희귀).

### 4.3 환생 업그레이드
- 파일: `/Users/hirediversity/Idle/data/balance/rebirth_upgrades_v1.csv`
- 브랜치(각 20레벨):
  - `cultivation_speed`
  - `breakthrough_bonus`
  - `tribulation_guard`
  - `potion_mastery`
  - `offline_efficiency`

### 4.4 로그라이크 요소
- 생애 시작 천부 3택1.
- 생애 중 랜덤 사건(기연/심마/봉인/비급).

## 5) 밸런스

### 5.1 KPI
- 생애 평균 길이.
- 환생 주기.
- 도겁 구간 사망률.
- 경지별 정체 시간.

### 5.2 1차 목표값
- 인간계 완주: 1~2일.
- 신선계 중반: 3~5일.
- 첫 진선계 도달: 2~3주.

### 5.3 보정 정책
- 연속 실패 보정치(천장) 적용.
- 고위 도겁은 준비 콘텐츠 없으면 실패 확률이 명확히 높아야 함.
- 시뮬레이션 결과:
  - `/Users/hirediversity/Idle/data/sim/progression_timing_sim_v1.csv`
  - `/Users/hirediversity/Idle/data/sim/progression_timing_summary_v1.csv`

## 6) 캐릭터
- 초기 1캐릭터 고정.
- 시작 배경 3종(초기 능력치/수련 특화 다름).
- 외형은 스킨 분리(능력치 비영향).

## 7) 옵션(QoL)
- 자동전투, 자동스킬, 자동돌파(조건부), 자동도겁(기본 OFF).
- 전투속도 1x/2x/3x.
- 저사양 이펙트 모드.
- 확률/공식 공개 토글.
- 옵션 해금표: `/Users/hirediversity/Idle/data/system/options_unlocks_v1.csv`

## 8) 아이템
- 장비: 무기/법보/방어구/장신구.
- 소모품: 영약/부적.
- 재료: 제련, 돌파, 도겁 준비.
- 경전: 스킬 해금/강화.
- 영약/부적 스펙: `/Users/hirediversity/Idle/data/balance/potions_talismans_v1.csv`
- 장비 베이스: `/Users/hirediversity/Idle/data/equipment/equipment_bases_v1.csv`
- 장비 어픽스: `/Users/hirediversity/Idle/data/equipment/equipment_affixes_v1.csv`
- 장비 롤링 규칙: `/Users/hirediversity/Idle/data/equipment/equipment_roll_rules_v1.csv`
- 장비 드롭 연동: `/Users/hirediversity/Idle/data/equipment/equipment_drop_links_v1.csv`

## 9) 맵
- 세계별 사냥터 + 관문 보스 + 이벤트 노드.
- 인간계: 산문/요수림/고분.
- 신선계: 비경/선궁 파편.
- 진선계: 법칙 균열.
- 맵 노드 시트: `/Users/hirediversity/Idle/data/map/map_nodes_v1.csv`
- 이벤트 시트: `/Users/hirediversity/Idle/data/map/map_events_v1.csv`
- 드롭풀 시트: `/Users/hirediversity/Idle/data/map/drop_pools_v1.csv`

## 10) 스탯
- 기본: 기혈, 진원, 공격, 방어, 속도, 명중, 회피.
- 확장: 치명, 치피, 관통, 피해감소, 도겁저항, 심마저항, 수련효율.
- 상한(초안): 치명 75%, 회피 60%, 피해감소 70%.
- 스탯 통합 계수표: `/Users/hirediversity/Idle/data/system/stat_growth_coeffs_v1.csv`

## 11) 스킬
- 종류: 공격기/방어기/보조기/도겁기.
- 슬롯: 액티브 4, 패시브 4, 궁극 1.
- 자동 우선순위 규칙(HP 임계치, 쿨다운, 진원 기준).
- 스킬 시트: `/Users/hirediversity/Idle/data/combat/skills_v1.csv`

## 12) 몹
- 타입: 일반/정예/보스/도겁환영.
- 속성: 화/빙/뇌/풍/토/무.
- 상성 보정 상한: ±25%.
- 몹 시트: `/Users/hirediversity/Idle/data/combat/monsters_v1.csv`

## 13) 구현 순서 (MVP)
1. 경지/돌파/도겁/환생 데이터 로더 구현.
2. 전투 최소 루프 구현(플레이어 1, 몹 3종, 스킬 2개).
3. 인간계 2단계 분량 세로 슬라이스.
4. 환생 1회 사이클 완성.
5. 수치 로그 수집 및 밸런스 1차 조정.

## 14) 즉시 할 일
1. [완료] 경지 한글 표기 매핑 테이블 확정.
2. [완료] 도겁 실패 3종 가중치(경미/퇴보/사망) 확정.
3. [완료] 영약/부적 리스트(최소 20종) 스펙 확정.
4. [완료] free asset 후보군 수집 후 라이선스 표 작성.

## 15) 런타임 연동
- JSON export 디렉터리: `/Users/hirediversity/Idle/data/export`
- TypeScript 로더: `/Users/hirediversity/Idle/src/balance/balanceLoader.ts`
- 재생성 명령:
```bash
/Users/hirediversity/Idle/scripts/generate_balance_tables.py
```

## 16) 에셋 운영 문서
- 후보군 표: `/Users/hirediversity/Idle/data/assets/free_asset_candidates_v1.csv`
- 파이프라인: `/Users/hirediversity/Idle/docs/assets/asset_pipeline_v1_kr.md`

## 17) 전투 데이터 문서
- 스킬/몹 설계: `/Users/hirediversity/Idle/docs/combat/skills_monsters_v1_kr.md`

## 18) 다음 순차 작업
1. [완료] 맵 노드/이벤트/드롭풀 데이터 시트 작성.
2. [완료] 스탯 성장식(레벨/경지/장비/환생) 통합 계수표 작성.
3. [완료] 옵션(QoL) 잠금/해금 조건 테이블 작성.

## 19) 시스템 데이터 문서
- 맵/이벤트/드롭풀: `/Users/hirediversity/Idle/docs/map/map_event_drop_v1_kr.md`
- 스탯/옵션: `/Users/hirediversity/Idle/docs/system/stat_option_tables_v1_kr.md`

## 20) 다음 순차 작업
1. [완료] 퀘스트/업적/마일스톤 보상 테이블 작성.
2. [완료] 상점/재화 소모 테이블 작성.
3. [완료] 밸런스 시뮬레이터(구간별 기대 성장 시간) 구축.

## 21) 확장 문서
- 메타 보상 테이블: `/Users/hirediversity/Idle/docs/meta/quest_achievement_milestone_v1_kr.md`
- 경제 테이블: `/Users/hirediversity/Idle/docs/economy/shop_currency_v1_kr.md`
- 시뮬레이션 가이드: `/Users/hirediversity/Idle/docs/sim/progression_timing_sim_v1_kr.md`

## 22) 다음 순차 작업
1. [완료] 장비/옵션(affix) 테이블 + 롤링 규칙 작성.
2. [완료] 퀘스트/상점/드롭 밸런스 자동 튜너 구축.
3. [완료] 저장용 스키마(JSON/TS 타입) + 검증기 추가.

## 23) 신규 문서
- 장비 롤링: `/Users/hirediversity/Idle/docs/equipment/equipment_affix_roll_v1_kr.md`
- 경제 튜너: `/Users/hirediversity/Idle/docs/economy/economy_tuner_v1_kr.md`
- 세이브 스키마: `/Users/hirediversity/Idle/docs/system/save_schema_v1_kr.md`

## 24) 다음 순차 작업
1. [완료] 장비 드롭 연동(노드별 베이스/어픽스 풀 매핑) 추가.
2. [완료] 경제 튜닝 자동 적용 스크립트 추가.
3. [완료] save_v1 -> save_v2 마이그레이션 골격 추가.

## 25) 추가 문서
- 장비 드롭 매핑: `/Users/hirediversity/Idle/docs/equipment/equipment_drop_link_v1_kr.md`
- 경제 적용 스크립트: `/Users/hirediversity/Idle/docs/economy/economy_apply_tuning_v1_kr.md`
- 저장 마이그레이션: `/Users/hirediversity/Idle/docs/system/save_migration_v1_to_v2_kr.md`

## 26) 다음 순차 작업
1. [완료] save_v2 정식 검증기(`validateSaveV2`) 추가 및 마이그레이션 연동.
2. [완료] balance export에 경제 profile(`base|tuned`) 선택 기능 추가.
3. [완료] tuned 경제 CSV 무결성 점검 스크립트 추가.

## 27) 추가 문서
- save v2 검증기: `/Users/hirediversity/Idle/docs/system/save_validator_v2_kr.md`
- 경제 profile export: `/Users/hirediversity/Idle/docs/economy/economy_export_profile_v1_kr.md`
- tuned 무결성 점검: `/Users/hirediversity/Idle/docs/economy/economy_tuned_consistency_check_v1_kr.md`

## 28) 다음 순차 작업
1. [완료] save_v2 실패 케이스 데이터셋(`set/delete`) 추가.
2. [완료] save_v2 실패 케이스 자동 점검 스크립트 추가.
3. [완료] save v2 파이썬 검증 로직 공통 모듈화.

## 29) 추가 문서
- save v2 실패 케이스 점검: `/Users/hirediversity/Idle/docs/system/save_failure_cases_v2_kr.md`

## 30) 다음 순차 작업
1. [완료] balance manifest 기반 economy profile 런타임 가드 API 추가.
2. [완료] profile summary 출력 API 추가.
3. [완료] runtime guard 사용 문서화.

## 31) 추가 문서
- 런타임 profile 가드: `/Users/hirediversity/Idle/docs/system/runtime_economy_profile_guard_v1_kr.md`

## 32) 다음 순차 작업
1. [완료] MVP 전투 최소 루프(플레이어 1, 몹 3종, 스킬 2개) 프로토타입 코드 추가.
2. [완료] 전투 로그/요약 리포트 API 추가.
3. [완료] 전투 최소 루프 사용 문서화.

## 33) 추가 문서
- 전투 최소 루프: `/Users/hirediversity/Idle/docs/combat/minimal_combat_loop_v1_kr.md`

## 34) 다음 순차 작업
1. [완료] 전투 최소 루프 결과 JSON 덤프 스크립트 추가.
2. [완료] 전투 최소 루프 결과 CSV(요약/액션 로그) 덤프 스크립트 추가.
3. [완료] 전투 덤프 실행/옵션 문서화.

## 35) 추가 문서
- 최소 전투 덤프: `/Users/hirediversity/Idle/docs/sim/minimal_combat_sim_v1_kr.md`

## 36) 다음 순차 작업
1. [완료] 전투 최소 루프에 속성 상성(화/빙/뇌/풍/토) 반영.
2. [완료] 전투 최소 루프에 상태이상(`burn/slow/stun`) 반영.
3. [완료] 전투 덤프 로그에 상성/상태 적용 컬럼 추가.

## 37) 추가 문서
- 최소 전투 루프(상성/상태): `/Users/hirediversity/Idle/docs/combat/minimal_combat_loop_v1_kr.md`

## 38) 다음 순차 작업
1. [완료] 몹 `special_mechanic` 일부를 최소 전투 루프에 반영.
2. [완료] Python 전투 덤프 스크립트에 동일 전투 규칙 반영.
3. [완료] TypeScript 타입체크 환경(`typescript`, `@types/node`, `tsconfig`) 구축.

## 39) 추가 문서
- TS 타입체크 셋업: `/Users/hirediversity/Idle/docs/system/typescript_typecheck_setup_v1_kr.md`

## 40) 다음 순차 작업
1. [완료] 최소 전투 루프에 `special_mechanic` 고급 효과(선공 배율/처형 배율/온히트 흡혈) 반영.
2. [완료] `weaken/armor_break` 상태를 피해 계산 배율로 반영.
3. [완료] 액션 로그 `selfHeal` 필드 추가 후 `npm run typecheck` 통과 확인.

## 41) 추가 문서
- 최소 전투 루프(특수기 확장): `/Users/hirediversity/Idle/docs/combat/minimal_combat_loop_v1_kr.md`

## 42) 다음 순차 작업
1. [완료] Python 최소 전투 시뮬레이터에 `special_mechanic` 전체 매핑 동기화.
2. [완료] Python 피해 계산에 `weaken/armor_break` 배율 + 선공/처형/흡혈 로직 반영.
3. [완료] Python 액션 로그 `self_heal` 컬럼 추가 및 덤프 결과 재생성.

## 43) 추가 문서
- 최소 전투 시뮬레이션 덤프(v1.2): `/Users/hirediversity/Idle/docs/sim/minimal_combat_sim_v1_kr.md`

## 44) 다음 순차 작업
1. [완료] TS 전투 리포트 JSON 덤프 스크립트 추가.
2. [완료] TS/PY 최소 전투 결과 자동 diff 스크립트 추가.
3. [완료] npm 스크립트(`combat:dump:ts`, `combat:diff:py-ts`) 연결 및 실행 검증.

## 45) 추가 문서
- 최소 전투 TS/PY diff: `/Users/hirediversity/Idle/docs/sim/minimal_combat_ts_py_diff_v1_kr.md`

## 46) 다음 순차 작업
1. [완료] Python 전투 RNG를 TS `xorshift32`와 동일하게 통일.
2. [완료] Python 반올림 규칙을 JS `Math.round`/`toFixed` 기준으로 통일.
3. [완료] TS/PY diff 기본 허용오차를 엄격 모드로 하향.

## 47) 추가 문서
- 최소 전투 TS/PY diff(엄격 기준): `/Users/hirediversity/Idle/docs/sim/minimal_combat_ts_py_diff_v1_kr.md`

## 48) 다음 순차 작업
1. [완료] GitHub Actions 워크플로우(`combat-diff-ci.yml`) 추가.
2. [완료] CI에서 `typecheck` + `combat:diff:py-ts` 자동 검증 연결.
3. [완료] TS/PY diff 문서에 CI 연동 규칙/실행 순서 반영.

## 49) 추가 문서
- 전투 diff CI 워크플로우: `/Users/hirediversity/Idle/.github/workflows/combat-diff-ci.yml`

## 50) 다음 순차 작업
1. [완료] 전투 diff 다중 시나리오 세트(`mortal/immortal/true`) JSON 추가.
2. [완료] 비교 스크립트에 `--scenario-file` 스위트 실행 모드 추가.
3. [완료] CI 워크플로우를 단일 검증에서 스위트 검증으로 전환.

## 51) 추가 문서
- 전투 diff 시나리오 세트: `/Users/hirediversity/Idle/data/sim/combat_diff_scenarios_v1.json`

## 52) 다음 순차 작업
1. [완료] 전투 diff 스크립트에 다중 시나리오(`--scenario-file`) 실행 기능 추가.
2. [완료] 스위트 시나리오(인간계/신선계/진선계) 3종 정의 및 실행 검증.
3. [완료] 스킬 상태이상 적용 범위를 TS 기준(`burn/slow/stun`)으로 정합화해 스위트 PASS 확보.

## 53) 추가 문서
- 전투 diff 가이드(스위트/형식): `/Users/hirediversity/Idle/docs/sim/minimal_combat_ts_py_diff_v1_kr.md`

## 54) 다음 순차 작업
1. [완료] 루트 `README.md` 추가 및 로컬/CI 검증 커맨드 정리.
2. [완료] CI 배지 URL 템플릿(`combat-diff-ci`) 추가.
3. [완료] GitHub Branch Protection Required Check 설정 가이드 문서화.

## 55) 추가 문서
- 저장소 README: `/Users/hirediversity/Idle/README.md`
- Required Check 가이드: `/Users/hirediversity/Idle/docs/system/github_required_checks_v1_kr.md`

## 56) 다음 순차 작업
1. [완료] 현재까지 작업 이력(전투/검증/CI) 회고 문서 작성.
2. [완료] 코드/운영 관점 검토 결과(Finding) 정리.
3. [완료] 개선사항 점검표(완료/진행 필요 항목) 정리.

## 57) 추가 문서
- 작업 기록·검토·개선 점검: `/Users/hirediversity/Idle/docs/system/work_log_review_improvement_v1_kr.md`

## 58) 다음 순차 작업
1. [완료] README CI 배지 URL을 실제 원격 저장소(`andrewchoi-hds/Idle`)로 치환.
2. [완료] GitHub Actions에 전투 diff 결과 artifact 업로드 스텝 추가.
3. [완료] 회고/점검 문서에서 미해결 항목 상태 갱신.

## 59) 추가 문서
- CI 워크플로우(artifact 포함): `/Users/hirediversity/Idle/.github/workflows/combat-diff-ci.yml`

## 60) 다음 순차 작업
1. [완료] Branch Protection 적용 시도 및 API 응답 확인.
2. [완료] private 저장소/플랜 제약 사항 문서화.
3. [완료] 회고 문서에 차단 원인/대응 옵션 반영.

## 61) 추가 문서
- Required Check 제약/대응: `/Users/hirediversity/Idle/docs/system/github_required_checks_v1_kr.md`

## 62) 다음 순차 작업
1. [완료] 저장소 `public` 전환.
2. [완료] `main` 브랜치 보호 규칙에 Required Check(`verify-combat-diff`) 적용.
3. [완료] 제약 문서를 현재 상태(적용 완료) 기준으로 갱신.

## 63) 추가 문서
- Required Check 적용 현황: `/Users/hirediversity/Idle/docs/system/github_required_checks_v1_kr.md`

## 64) 다음 순차 작업
1. [완료] 브랜치 보호 규칙 보강(`enforce_admins`, `required_conversation_resolution`).
2. [완료] PR 템플릿 추가로 검증 체크리스트 표준화.
3. [완료] PR 기반 협업 절차 문서(`pr_workflow_v1_kr.md`) 추가.

## 65) 추가 문서
- PR 템플릿: `/Users/hirediversity/Idle/.github/pull_request_template.md`
- PR 워크플로우 가이드: `/Users/hirediversity/Idle/docs/system/pr_workflow_v1_kr.md`

## 66) 다음 순차 작업
1. [완료] 돌파/도겁 런타임 판정 엔진(`evaluateBreakthroughAttempt`) 추가.
2. [완료] 도겁 다회 시뮬레이션 덤프 스크립트(`tribulation:dump:ts`) 추가.
3. [완료] 도겁 런타임 계산식/입출력 문서화.

## 67) 추가 문서
- 도겁 런타임 가이드: `/Users/hirediversity/Idle/docs/system/tribulation_runtime_v1_kr.md`
- 도겁 샘플 결과: `/Users/hirediversity/Idle/data/sim/tribulation_trials_ts_v1.json`

## 68) 다음 순차 작업
1. [완료] `save_v2` 기준 자동 돌파/자동 도겁 1스텝 적용 API 추가.
2. [완료] 돌파 결과를 `pity_counters`/경지/기력/인벤토리에 반영.
3. [완료] `save_v2` 샘플 입력 기반 런타임 덤프 스크립트 추가.

## 69) 추가 문서
- save_v2 돌파 런타임 가이드: `/Users/hirediversity/Idle/docs/system/save_breakthrough_runtime_v1_kr.md`
- save_v2 돌파 스텝 샘플: `/Users/hirediversity/Idle/data/sim/save_v2_breakthrough_step_ts_v1.json`

## 70) 다음 순차 작업
1. [완료] `death_fail` 시 환생 정산(경지/재화 리셋 + 윤회정수 지급) 로직 추가.
2. [완료] 환생 보상에 `rebirth_essence_mul_pct` 소모품 배율 반영.
3. [완료] 환생 정산 검증을 위한 덤프 스크립트 옵션(`--override-difficulty-index`) 추가.

## 71) 추가 문서
- save_v2 환생 정산(도겁 사망) 반영: `/Users/hirediversity/Idle/docs/system/save_breakthrough_runtime_v1_kr.md`

## 72) 다음 순차 작업
1. [완료] `save_v2` 자동 진행 틱 루프(`수련/전투/돌파/도겁`) 런타임 API 추가.
2. [완료] 1분/10분 시뮬레이션용 덤프 스크립트(`save:auto:tick:ts`) 추가.
3. [완료] 자동 진행 결과 요약/이벤트 로그(JSON) 출력 포맷 정의.

## 73) 추가 문서
- save_v2 자동 진행 루프 가이드: `/Users/hirediversity/Idle/docs/system/save_auto_progress_tick_runtime_v1_kr.md`
- save_v2 자동 진행 샘플: `/Users/hirediversity/Idle/data/sim/save_v2_auto_progress_tick_ts_v1.json`

## 74) 다음 순차 작업
1. [완료] 자동 진행 루프 회귀 시나리오(JSON) 정의.
2. [완료] 자동 진행 회귀 점검 스크립트(`save:auto:regression:check`) 추가.
3. [완료] CI Required Check(`verify-combat-diff`)에 자동 진행 회귀 점검 연결.

## 75) 추가 문서
- 자동 진행 회귀 시나리오: `/Users/hirediversity/Idle/data/sim/save_auto_progress_regression_scenarios_v1.json`

## 76) 다음 순차 작업
1. [완료] 자동 진행 회귀 체크 출력 파일을 임시 경로로 격리해 샘플 JSON 오염 제거.
2. [완료] 회귀 시나리오에서 고정 `output_path` 의존 제거.
3. [완료] `typecheck`/회귀 체크/전투 diff 스위트 재검증.

## 77) 추가 문서
- 자동 진행 루프 회귀 체크 운영 보강: `/Users/hirediversity/Idle/docs/system/save_auto_progress_tick_runtime_v1_kr.md`

## 78) 다음 순차 작업
1. [완료] `save_v2` 오프라인 복귀 정산 런타임 API(`runSaveOfflineCatchupRuntime`) 추가.
2. [완료] 오프라인 복귀 시뮬레이션 덤프 스크립트(`save:offline:catchup:ts`) 추가.
3. [완료] 모바일 복귀 흐름(경과시간 계산/12시간 캡/타임스탬프 동기화) 문서화.

## 79) 추가 문서
- save_v2 오프라인 복귀 정산 가이드: `/Users/hirediversity/Idle/docs/system/save_offline_catchup_runtime_v1_kr.md`
- save_v2 오프라인 복귀 샘플: `/Users/hirediversity/Idle/data/sim/save_v2_offline_catchup_ts_v1.json`

## 80) 다음 순차 작업
1. [완료] 오프라인 정산 회귀 시나리오(JSON) 정의.
2. [완료] 오프라인 정산 회귀 점검 스크립트(`save:offline:regression:check`) 추가.
3. [완료] CI Required Check(`verify-combat-diff`)에 오프라인 회귀 점검 연결.

## 81) 추가 문서
- 오프라인 정산 회귀 시나리오: `/Users/hirediversity/Idle/data/sim/save_offline_catchup_regression_scenarios_v1.json`

## 82) 다음 순차 작업
1. [완료] 저장 회귀 스크립트(`auto/offline`)에 JSON 리포트(`--report-file`) 출력 지원 추가.
2. [완료] CI에서 회귀 리포트 기반 Step Summary Markdown 자동 생성 연결.
3. [완료] PR 템플릿 `Summary/Changes` 작성 가이드 보강 및 검증 체크리스트 확장.

## 83) 추가 문서
- 저장 회귀 CI 요약 생성 스크립트: `/Users/hirediversity/Idle/scripts/build_save_regression_ci_summary_v1.py`

## 84) 다음 순차 작업
1. [완료] PR 본문 자동 생성 스크립트(`pr:body:gen`) 추가.
2. [완료] PR 워크플로우를 자동 생성 본문(`--body-file /tmp/idle_pr_body_v1.md`) 기준으로 갱신.
3. [완료] PR 본문 자동화 사용 가이드 문서 추가.

## 85) 추가 문서
- PR 본문 자동 생성기 가이드: `/Users/hirediversity/Idle/docs/system/pr_body_generator_v1_kr.md`

## 86) 다음 순차 작업
1. [완료] PR 본문 생성 + PR 생성/업데이트를 묶은 자동화 스크립트(`pr:create:auto`) 추가.
2. [완료] PR 본문 기본 경로를 `/private/tmp/idle_pr_body_v1.md`로 통일.
3. [완료] PR 자동 생성 워크플로우 문서화.

## 87) 추가 문서
- PR 자동 생성/업데이트 가이드: `/Users/hirediversity/Idle/docs/system/pr_create_auto_v1_kr.md`

## 88) 다음 순차 작업
1. [완료] PR 체크 대기 + 자동 머지 스크립트(`pr:merge:auto`) 추가.
2. [완료] PR 워크플로우에 자동 머지 단계 반영.
3. [완료] PR 자동 머지 사용 가이드 문서 추가.

## 89) 추가 문서
- PR 자동 머지 가이드: `/Users/hirediversity/Idle/docs/system/pr_merge_auto_v1_kr.md`

## 90) 다음 순차 작업
1. [완료] PR 생성+머지 단계를 묶은 원클릭 스크립트(`pr:ship:auto`) 추가.
2. [완료] PR 워크플로우에 `pr:ship:auto` 단계 반영.
3. [완료] 원클릭 ship 자동화 가이드 문서 추가.

## 91) 추가 문서
- PR 원클릭 ship 가이드: `/Users/hirediversity/Idle/docs/system/pr_ship_auto_v1_kr.md`

## 92) 다음 순차 작업
1. [완료] `verify-combat-diff` workflow의 `push` 트리거를 `main` 브랜치로 한정.
2. [완료] workflow `concurrency` 설정으로 동일 ref 중복 실행 취소 적용.
3. [완료] Required Check/PR 워크플로우 문서에 트리거 최적화 기준 반영.

## 93) 추가 문서
- Required Check 운영 가이드(트리거 최적화 반영): `/Users/hirediversity/Idle/docs/system/github_required_checks_v1_kr.md`

## 94) 다음 순차 작업
1. [완료] PR 자동 승인 스크립트(`pr:review:auto`) 추가.
2. [완료] 원클릭 ship(`pr:ship:auto`)에 자동 승인 단계를 기본 삽입.
3. [완료] PR 워크플로우/README에 자동 승인 운영 가이드 반영.

## 95) 추가 문서
- PR 자동 승인 가이드: `/Users/hirediversity/Idle/docs/system/pr_review_auto_v1_kr.md`

## 96) 다음 순차 작업
1. [완료] PR 본문 품질 lint 스크립트(`pr:body:lint`) 추가.
2. [완료] PR 생성 자동화(`pr:create:auto`)에 본문 lint 단계 기본 연동.
3. [완료] 원클릭 ship(`pr:ship:auto`)에서 본문 lint 옵션 전달 및 운영 문서 반영.

## 97) 추가 문서
- PR 본문 품질 Lint 가이드: `/Users/hirediversity/Idle/docs/system/pr_body_lint_v1_kr.md`

## 98) 다음 순차 작업
1. [완료] PR 본문 lint 스크립트가 GitHub `pull_request` 이벤트 본문(`GITHUB_EVENT_PATH`)을 직접 검사하도록 확장.
2. [완료] Required Check workflow(`verify-combat-diff`)에 PR 본문 lint 선행 단계 추가.
3. [완료] Required Check/PR 워크플로우 문서에 PR 본문 품질 게이트 운영 기준 반영.

## 99) 추가 문서
- Required Check 가이드(PR 본문 품질 게이트 반영): `/Users/hirediversity/Idle/docs/system/github_required_checks_v1_kr.md`

## 100) 다음 순차 작업
1. [완료] PR 본문 lint 스크립트에 요약 Markdown 출력(`--summary-file`) 기능 추가.
2. [완료] `verify-combat-diff` workflow에서 PR 본문 lint 결과를 Step Summary에 항상 기록하도록 보강.
3. [완료] Required Check/PR 워크플로우 문서에 본문 lint 요약 확인 절차 반영.

## 101) 추가 문서
- PR 본문 품질 Lint 가이드(Step Summary 반영): `/Users/hirediversity/Idle/docs/system/pr_body_lint_v1_kr.md`

## 102) 다음 순차 작업
1. [완료] PR 본문 자동 생성기에서 파일별 변경량(`git numstat`) 수집 로직 추가.
2. [완료] `Summary`에 변경 규모(`files/commits/+add/-del`) 자동 표기 추가.
3. [완료] `Changes`/`Notes`에 파일별 라인 증감 및 커밋 해시를 포함하도록 생성 포맷 개선.

## 103) 추가 문서
- PR 본문 자동 생성기 가이드(변경량/커밋 해시 반영): `/Users/hirediversity/Idle/docs/system/pr_body_generator_v1_kr.md`

## 104) 다음 순차 작업
1. [완료] PR 본문 lint 회귀 체크 스크립트(`pr:body:lint:regression:check`) 추가.
2. [완료] Required Check workflow(`verify-combat-diff`)에 PR 본문 lint 회귀 단계 연동.
3. [완료] README/운영 문서에 PR 본문 lint 회귀 점검 절차 반영.

## 105) 추가 문서
- PR 본문 Lint 회귀 체크 가이드: `/Users/hirediversity/Idle/docs/system/pr_body_lint_regression_v1_kr.md`

## 106) 다음 순차 작업
1. [완료] PR 본문 lint 회귀 체크 리포트 출력 명령(`pr:body:lint:regression:check:report`) 추가.
2. [완료] 회귀 리포트 기반 Markdown 요약 생성 스크립트(`pr:body:lint:regression:summary:md`) 추가.
3. [완료] Required Check workflow Step Summary/Artifacts에 PR 본문 lint 회귀 요약 연동.

## 107) 추가 문서
- PR 본문 Lint 회귀 체크 가이드(Step Summary 반영): `/Users/hirediversity/Idle/docs/system/pr_body_lint_regression_v1_kr.md`

## 108) 다음 순차 작업
1. [완료] PR 템플릿 `Validation` 체크리스트에 PR 본문 lint 회귀 명령 추가.
2. [완료] PR 본문 생성기/본문 lint의 표준 검증 명령 목록을 5개 기준으로 동기화.
3. [완료] PR 본문 lint 회귀 fixture를 동기화된 검증 체크리스트 기준으로 갱신.

## 109) 추가 문서
- PR 본문 자동 생성기 가이드(Validation 6개 커맨드 기준): `/Users/hirediversity/Idle/docs/system/pr_body_generator_v1_kr.md`

## 110) 다음 순차 작업
1. [완료] PR Validation 표준 명령 목록을 단일 소스 모듈(`pr_validation_commands_v1.py`)로 분리.
2. [완료] PR 템플릿 Validation 섹션과 표준 명령 목록 동기화 점검 스크립트(`pr:validation:sync:check`) 추가.
3. [완료] Required Check workflow에 `PR Validation Checklist Sync` 단계 연동 및 관련 문서 반영.

## 111) 추가 문서
- PR Validation 체크리스트 동기화 가이드: `/Users/hirediversity/Idle/docs/system/pr_validation_checklist_sync_v1_kr.md`

## 112) 다음 순차 작업
1. [완료] PR Validation 동기화 체크 스크립트에 자동 보정 모드(`--write`) 추가.
2. [완료] 동기화 체크 결과를 Step Summary로 출력하는 옵션(`--summary-file`) 추가 및 workflow 연동.
3. [완료] npm 명령(`pr:validation:sync:apply`)과 운영 문서에 자동 보정/요약 절차 반영.

## 113) 추가 문서
- PR Validation 체크리스트 동기화 가이드(자동 보정/요약 반영): `/Users/hirediversity/Idle/docs/system/pr_validation_checklist_sync_v1_kr.md`

## 114) 다음 순차 작업
1. [완료] PR Validation 동기화 스크립트 회귀 체크 스크립트(`pr:validation:sync:regression:check`) 추가.
2. [완료] 회귀 리포트/CI 요약 생성 명령(`pr:validation:sync:regression:check:report`, `pr:validation:sync:regression:summary:md`) 추가.
3. [완료] Required Check workflow Step Summary/Artifacts에 PR Validation 동기화 회귀 결과 연동.

## 115) 추가 문서
- PR Validation 동기화 회귀 체크 가이드: `/Users/hirediversity/Idle/docs/system/pr_validation_sync_regression_v1_kr.md`

## 116) 다음 순차 작업
1. [완료] PR 본문 lint의 Validation 섹션 점검을 존재 여부에서 항목/순서 정확 일치 검증으로 강화.
2. [완료] PR 본문 lint 회귀 체크에 Validation 순서/비표준 커맨드 실패 케이스 추가.
3. [완료] PR 본문 lint/회귀 체크 운영 문서에 강화된 Validation 기준 반영.

## 117) 추가 문서
- PR 본문 품질 Lint 가이드(Validation 순서 검증 반영): `/Users/hirediversity/Idle/docs/system/pr_body_lint_v1_kr.md`
- PR 본문 Lint 회귀 체크 가이드(Validation 실패 케이스 반영): `/Users/hirediversity/Idle/docs/system/pr_body_lint_regression_v1_kr.md`
