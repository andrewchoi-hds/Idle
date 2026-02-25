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

## 118) 다음 순차 작업
1. [완료] PR 본문 생성기 회귀 체크 스크립트(`pr:body:gen:regression:check`) 추가.
2. [완료] 회귀 리포트/CI 요약 생성 명령(`pr:body:gen:regression:check:report`, `pr:body:gen:regression:summary:md`) 추가.
3. [완료] Required Check workflow Step Summary/Artifacts에 PR 본문 생성기 회귀 결과 연동.

## 119) 추가 문서
- PR 본문 생성기 가이드(회귀 체크 반영): `/Users/hirediversity/Idle/docs/system/pr_body_generator_v1_kr.md`
- PR 본문 생성기 회귀 체크 가이드: `/Users/hirediversity/Idle/docs/system/pr_body_generator_regression_v1_kr.md`

## 120) 다음 순차 작업
1. [완료] PR Validation 표준 명령 목록에 회귀 체크 2종(`pr:body:gen:regression:check`, `pr:validation:sync:regression:check`) 추가.
2. [완료] PR 템플릿 Validation 체크리스트를 8개 표준 명령 기준으로 자동 동기화.
3. [완료] PR 본문 lint/본문 생성기 문서에 8개 표준 검증 명령 기준 반영.

## 121) 추가 문서
- PR 본문 품질 Lint 가이드(Validation 8개 커맨드 기준): `/Users/hirediversity/Idle/docs/system/pr_body_lint_v1_kr.md`
- PR 본문 자동 생성기 가이드(Validation 8개 커맨드 기준): `/Users/hirediversity/Idle/docs/system/pr_body_generator_v1_kr.md`

## 122) 다음 순차 작업
1. [완료] Required Check workflow 커버리지 점검 스크립트(`pr:required-check:coverage:check`) 추가.
2. [완료] `verify-combat-diff`에 `PR Required Check Coverage` 단계/Step Summary 연동.
3. [완료] PR Validation 표준 명령/템플릿/문서를 9개 커맨드 기준으로 동기화.

## 123) 추가 문서
- PR Required Check 커버리지 가이드: `/Users/hirediversity/Idle/docs/system/pr_required_check_coverage_v1_kr.md`
- PR 본문 품질 Lint 가이드(Validation 9개 커맨드 기준): `/Users/hirediversity/Idle/docs/system/pr_body_lint_v1_kr.md`

## 124) 다음 순차 작업
1. [완료] PR Validation 명령 레지스트리 점검 스크립트(`pr:validation:registry:check`) 추가.
2. [완료] `verify-combat-diff`에 `PR Validation Command Registry` 단계/Step Summary 연동.
3. [완료] PR Validation 표준 명령/템플릿/문서를 10개 커맨드 기준으로 동기화.

## 125) 추가 문서
- PR Validation 명령 레지스트리 가이드: `/Users/hirediversity/Idle/docs/system/pr_validation_registry_v1_kr.md`
- PR 본문 품질 Lint 가이드(Validation 10개 커맨드 기준): `/Users/hirediversity/Idle/docs/system/pr_body_lint_v1_kr.md`

## 126) 다음 순차 작업
1. [완료] 모바일 MVP 수직슬라이스 UI(`mobile/mvp_v1`)에 전투/돌파/환생/저장복구 플로우 구현.
2. [완료] 모바일 MVP 수직슬라이스 회귀 체크(`mobile:mvp:check`) 추가 및 Required Check workflow 연동.
3. [완료] PR Validation 표준 명령/템플릿/문서를 11개 커맨드 기준으로 동기화.

## 127) 추가 문서
- 모바일 MVP 수직슬라이스 가이드: `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`
- PR 본문 품질 Lint 가이드(Validation 11개 커맨드 기준): `/Users/hirediversity/Idle/docs/system/pr_body_lint_v1_kr.md`

## 128) 다음 순차 작업
1. [완료] 모바일 MVP 저장 상태에 마지막 활동 시각(`lastActiveEpochMs`) 추가.
2. [완료] 모바일 MVP 부트스트랩/불러오기 경로에 오프라인 복귀 정산(12시간 cap) 연동.
3. [완료] 모바일 MVP 회귀 체크에 오프라인 정산 cap/타임스탬프 동기화 시나리오 추가.

## 129) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 복귀 정산 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 130) 다음 순차 작업
1. [완료] 모바일 MVP 오프라인 복귀 결과를 표시하는 팝업 카드(`offlineModal`) UI 추가.
2. [완료] 부트스트랩/불러오기 경로에서 정산 발생 시 팝업 자동 오픈 및 닫기 동작(버튼/배경/ESC) 연동.
3. [완료] 팝업 카드에 정산 시간, cap 적용 여부, 전투/돌파/환생, 재화 순변화(±) 표시 추가.

## 131) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 정산 팝업 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 132) 다음 순차 작업
1. [완료] 오프라인 정산 팝업에 세부 로그 토글(`btnToggleOfflineDetail`) 추가.
2. [완료] 오프라인 자동 정산 루프에서 최근 이벤트 수집(`collectedEvents`) 지원.
3. [완료] 오프라인 정산 리포트 JSON 내보내기(`btnExportOfflineReport`) 기능 추가.

## 133) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 정산 세부 로그/리포트 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 134) 다음 순차 작업
1. [완료] 모바일 MVP에 safe-area(inset) 대응 패딩 적용(`app`/`offlineModal`).
2. [완료] 모바일 터치 타겟 개선(버튼/입력 최소 높이 44px + focus-visible 스타일).
3. [완료] 소형 뷰포트에서 액션 패널 sticky, 로그 스크롤 영역 적용으로 조작성 보강.

## 135) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(모바일 뷰포트 최적화 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 136) 다음 순차 작업
1. [완료] 모바일 옵션 패널에 오프라인 정산 cap 시간(`offlineCapHours`) 설정 추가.
2. [완료] 오프라인 세부 로그 수집 개수(`offlineEventLimit`) 설정 추가 및 정산 엔진 연동.
3. [완료] 저장 roundtrip/오프라인 정산 회귀 체크에 신규 옵션 영속화 검증 반영.

## 137) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 옵션 설정 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 138) 다음 순차 작업
1. [완료] 모바일 MVP UI 계약(필수 id/모달/safe-area) 점검 스크립트(`mobile:mvp:dom:check`) 추가.
2. [완료] `mobile:mvp:check`에 DOM 계약 체크를 포함해 기능+UI 계약을 단일 명령으로 검증.
3. [완료] README/모바일 MVP 가이드에 DOM 계약 체크 절차 반영.

## 139) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(DOM 계약 체크 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 140) 다음 순차 작업
1. [완료] 모바일 옵션 패널에 전투 속도(`battleSpeed`) 선택 UI(저속/표준/고속) 추가.
2. [완료] 자동 10초/오프라인 정산에서 전투 속도 기반 루프 cadence(전투/돌파 주기, 패시브 기 비율) 공통 적용.
3. [완료] 모바일 회귀 체크에 전투 속도 설정별 cadence 차이 검증 시나리오 추가.

## 141) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(전투 속도 옵션 연동 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 142) 다음 순차 작업
1. [완료] 모바일 액션 패널에 실시간 자동 진행 토글(`btnRealtimeAuto`) 및 상태 표시(`realtimeAutoStatus`) 추가.
2. [완료] 엔진 자동 루프에 타임라인 오프셋(`timelineOffsetSec`) 지원을 추가해 1초 chunk 연속 실행에서도 cadence 유지.
3. [완료] 실시간 자동 루프 운영 규칙(10초 요약 로그, 3틱 저장 동기화, 백그라운드 진입 시 중지) 반영.

## 143) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(실시간 자동 진행 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 144) 다음 순차 작업
1. [완료] 문서 가시성 라이프사이클에서 백그라운드 진입 시 실시간 자동 루프 중지 처리 추가.
2. [완료] 포그라운드 복귀 시 오프라인 정산 자동 적용(`applyResumeCatchupIfNeeded`) 추가.
3. [완료] 모바일 회귀 체크에 오프라인 무경과(skipReason=`time_not_elapsed`) 시나리오 추가.

## 145) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(백그라운드/복귀 정산 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 146) 다음 순차 작업
1. [완료] 설정에 실시간 자동 재개 옵션(`autoResumeRealtime`) 추가 및 저장 영속화 반영.
2. [완료] 앱 진입/포그라운드 복귀/세이브 불러오기 경로에서 옵션 활성 시 실시간 자동 루프 자동 재개.
3. [완료] 회귀 체크에 `autoResumeRealtime` 저장 roundtrip 검증 포함.

## 147) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(실시간 자동 재개 옵션 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 148) 다음 순차 작업
1. [완료] 액션 패널에 실시간 누적 통계 카드(시간/전투/돌파/환생) 추가.
2. [완료] 실시간 세션 리포트 JSON 내보내기(`btnExportRealtimeReport`) 기능 추가.
3. [완료] DOM 계약 체크에 실시간 통계/리포트 관련 필수 요소 검증 추가.

## 149) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(실시간 통계/리포트 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 150) 다음 순차 작업
1. [완료] 실시간 누적 통계(`realtimeStats`)를 save 상태에 포함해 앱 재진입 시 유지되도록 확장.
2. [완료] 액션 패널에 `실시간 통계 초기화` 버튼을 추가하고 세션 앵커/누적값 리셋 처리.
3. [완료] 실시간 리포트 JSON 내보내기를 저장된 `realtimeStats` 기반으로 재구성.

## 151) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(실시간 통계 영속화 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 152) 다음 순차 작업
1. [완료] 모바일 MVP 저장/불러오기를 슬롯(1~3) 기반 localStorage 키로 확장.
2. [완료] 슬롯 선호값(`slot_pref`) 저장 및 bootstrap 자동 로드 경로 연동.
3. [완료] 회귀 체크에 슬롯 정규화/키 생성 유틸 검증 추가.

## 153) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(세이브 슬롯 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 154) 다음 순차 작업
1. [완료] 저장 패널에 활성 슬롯 삭제 버튼(`btnDeleteSlot`) 추가.
2. [완료] 슬롯 요약 목록(`saveSlotSummaryList`)을 추가해 슬롯별 저장 상태를 시각화.
3. [완료] DOM 계약 체크에 슬롯 삭제/요약 관련 필수 요소 검증 추가.

## 155) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(슬롯 요약/삭제 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 156) 다음 순차 작업
1. [완료] 저장 패널에 슬롯 복제 대상 선택(`optCopySlotTarget`) 및 복제 버튼(`btnCopySlot`) 연동.
2. [완료] 활성 슬롯 데이터가 있을 때 대상 슬롯으로 raw payload를 복제하는 저장 유틸(`safeLocalSetItem`) 경로 추가.
3. [완료] DOM 계약 체크에 슬롯 복제 관련 필수 요소 검증 추가.

## 157) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(슬롯 복제 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 158) 다음 순차 작업
1. [완료] 슬롯 요약 목록 항목에 `data-slot/data-state` 메타를 추가해 클릭 액션 기준 슬롯/상태를 판별하도록 확장.
2. [완료] 슬롯 요약 항목 클릭/Enter 입력 시 즉시 슬롯 활성화 + 저장 데이터 존재 시 즉시 불러오기(퀵 액션) 연동.
3. [완료] `btnLoadLocal` 불러오기 흐름을 공통 함수(`tryLoadActiveSlot`)로 통합해 중복 제거.

## 159) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(슬롯 요약 퀵 로드 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 160) 다음 순차 작업
1. [완료] 슬롯 요약 퀵 액션 분기 로직을 엔진 순수 함수(`resolveSlotSummaryQuickAction`)로 분리.
2. [완료] 모바일 회귀 체크(`mobile:mvp:check`)에 슬롯 요약 `ok/empty/corrupt` 분기 시나리오 추가.
3. [완료] 앱 슬롯 요약 클릭 핸들러가 순수 분기 함수 결과를 사용하도록 연동.

## 161) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(슬롯 요약 퀵 액션 회귀 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 162) 다음 순차 작업
1. [완료] 슬롯 액션 확인 문구 포맷을 공통 함수(`buildSlotActionConfirmMessage`)로 통일.
2. [완료] 슬롯 복제 시 대상 슬롯이 비어있지 않으면 overwrite 확인 후 진행하도록 규칙화.
3. [완료] 슬롯 삭제/요약 퀵 로드에서 빈 슬롯 skip, 타 슬롯 퀵로드 확인 모달 규칙 추가.

## 163) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(슬롯 액션 확인 규칙 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 164) 다음 순차 작업
1. [완료] 슬롯 요약 퀵 로드 연속 탭 방지를 위한 디바운스 가드(0.7초) 추가.
2. [완료] 디바운스 판정을 엔진 순수 함수(`resolveDebouncedAction`)로 분리해 앱/회귀 스크립트 공용화.
3. [완료] 모바일 회귀 체크에 퀵 로드 더블탭 차단 시나리오 추가.

## 165) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(슬롯 퀵 로드 디바운스 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 166) 다음 순차 작업
1. [완료] 슬롯 복제/삭제 확인 규칙을 엔진 정책 함수(`resolveSlotCopyPolicy`, `resolveSlotDeletePolicy`)로 분리.
2. [완료] 앱 슬롯 복제/삭제 핸들러가 정책 함수 결과(`allowed/requiresConfirm/reason`)를 사용하도록 연동.
3. [완료] 모바일 회귀 체크에 슬롯 복제/삭제 정책 시나리오 추가.

## 167) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(슬롯 복제/삭제 정책 회귀 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 168) 다음 순차 작업
1. [완료] 슬롯 복제 정책에 소스 슬롯 상태(`source_empty/source_corrupt`)를 포함하도록 확장.
2. [완료] 저장 패널 렌더에서 복제/삭제 버튼 활성 상태를 정책 기반으로 동기화.
3. [완료] 모바일 회귀 체크에 소스 슬롯 상태 기반 복제 차단 시나리오 추가.

## 169) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(슬롯 액션 버튼 비활성화 규칙 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 170) 다음 순차 작업
1. [완료] 슬롯 정책 결과를 사용자에게 노출하는 액션 힌트 영역(`slotActionHint`) 추가.
2. [완료] 엔진에 정책 기반 힌트 함수(`resolveSlotCopyHint`, `resolveSlotDeleteHint`)를 추가해 앱/UI 공용화.
3. [완료] 모바일 회귀 체크에 슬롯 액션 힌트-정책 매핑 검증 시나리오 추가.

## 171) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(슬롯 액션 힌트 정책 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 172) 다음 순차 작업
1. [완료] 슬롯 액션 힌트를 복제/삭제 2개 라인(`slotCopyHint`, `slotDeleteHint`)으로 분리.
2. [완료] 엔진에 힌트 톤 함수(`resolveSlotCopyHintTone`, `resolveSlotDeleteHintTone`)를 추가해 정책 기반 색상 분기 공용화.
3. [완료] 모바일 회귀 체크에 힌트 톤-정책 매핑 검증 시나리오 추가.

## 173) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(슬롯 액션 힌트 톤 분기 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 174) 다음 순차 작업
1. [완료] 복제 대상 슬롯 선택에서 활성 슬롯 옵션을 비활성화하는 동기화 로직 추가.
2. [완료] 옵션 비활성 판정을 엔진 순수 함수(`isCopyTargetSlotDisabled`)로 분리해 앱/회귀 공용화.
3. [완료] 모바일 회귀 체크에 복제 대상 옵션 비활성 판정 시나리오 추가.

## 175) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(복제 대상 활성 슬롯 옵션 비활성화 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 176) 다음 순차 작업
1. [완료] 저장 패널에 복제 대상 슬롯 상태 프리뷰(`slotTargetHint`) 라인 추가.
2. [완료] 슬롯 상태 라벨/톤 함수를 엔진 순수 함수(`resolveSlotSummaryStateLabelKo`, `resolveSlotSummaryStateTone`)로 분리해 UI/회귀 공용화.
3. [완료] 모바일 회귀 체크에 복제 대상 상태 라벨/톤 매핑 시나리오 추가.

## 177) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(복제 대상 슬롯 상태 프리뷰 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 178) 다음 순차 작업
1. [완료] 복제 대상 셀렉트 옵션 라벨에 슬롯 상태(`저장됨/비어있음/손상`) 표시를 추가.
2. [완료] 슬롯 상태 short 라벨 함수를 엔진 순수 함수(`resolveSlotSummaryStateShortKo`)로 분리해 UI/회귀 공용화.
3. [완료] 모바일 회귀 체크에 슬롯 상태 short 라벨 매핑 검증 시나리오 추가.

## 179) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(복제 대상 옵션 상태 라벨 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 180) 다음 순차 작업
1. [완료] 슬롯 복제 소스를 localStorage payload에서 현재 메모리 상태 스냅샷으로 전환.
2. [완료] 슬롯 복제 정책에서 소스 슬롯 저장상태 의존(`source_empty/source_corrupt`)을 제거.
3. [완료] 모바일 회귀 체크/힌트 규칙을 새로운 복제 정책(`same_slot` 중심) 기준으로 갱신.

## 181) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(메모리 스냅샷 기반 슬롯 복제 정책 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 182) 다음 순차 작업
1. [완료] 슬롯 잠금 상태(`slot_locks`)를 localStorage에 저장하고 활성 슬롯 잠금/해제 버튼(`btnToggleSlotLock`)을 추가.
2. [완료] 슬롯 복제/삭제 정책 함수가 잠금 상태(`target_locked`, `slot_locked`)를 인지하도록 확장.
3. [완료] 슬롯 요약/복제 대상 옵션/액션 힌트에서 잠금 상태 배지 및 안내 문구를 표시하고 회귀 체크에 잠금 시나리오를 추가.

## 183) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(슬롯 잠금 보호 정책 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 184) 다음 순차 작업
1. [완료] 돌파 확률 프리뷰를 `성공/사망` 2지표에서 `성공/경상/후퇴/사망` 4지표로 확장.
2. [완료] 엔진 확률 프리뷰(`previewBreakthroughChance`)가 분기별 실효 확률(`minorFailPct/retreatFailPct/deathFailPct`)을 계산해 반환하도록 개선.
3. [완료] 모바일 회귀 체크에 돌파 분기 확률 합(100%) 및 영약/수호부 적용 시 분포 변화 일관성 시나리오 추가.

## 185) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(도겁 4분기 확률 프리뷰 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 186) 다음 순차 작업
1. [완료] 도겁 프리뷰에 위험도 판정 함수(`resolveBreakthroughRiskTier`)를 추가하고 `비도겁/경미/주의/위험/치명` 단계로 분류.
2. [완료] 모바일 UI에 위험도 배지(`previewRiskLabel`)와 실패 내 사망 비율(`previewDeathInFailPct`) 표시를 추가.
3. [완료] 회귀 체크에 위험도 하향(영약/수호부 보정 시) 및 실패 분기 내부 합(100%) 검증 시나리오를 추가.

## 187) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(도겁 위험도 배지 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 188) 다음 순차 작업
1. [완료] 엔진에 돌파 권장 정책 함수(`resolveBreakthroughRecommendation`)를 추가해 위험도/보유 자원/사용 설정 기반 액션 가이드를 생성.
2. [완료] 모바일 UI에 돌파 권장 배지/설명(`previewRecommendationLabel`, `previewRecommendationHint`)을 추가.
3. [완료] 모바일 회귀 체크에 돌파 권장 정책 시나리오(수호부 권장/준비 완료/자원 비축) 검증을 추가.

## 189) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(도겁 돌파 권장 정책 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 190) 다음 순차 작업
1. [완료] 엔진에 권장 토글 정책 함수(`resolveBreakthroughRecommendationToggles`)를 추가해 위험도/보유 자원 기준 영약·수호부 on/off 값을 계산.
2. [완료] 모바일 UI에 `권장 설정 적용` 버튼(`btnApplyRecommendation`)을 추가해 권장 토글을 즉시 반영.
3. [완료] 회귀 체크에 권장 토글 정책 시나리오(고위험/중위험 자원 부족/비도겁 해제)를 추가.

## 191) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(도겁 권장 설정 적용 버튼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 192) 다음 순차 작업
1. [완료] 엔진에 보정 효과 요약 함수(`resolveBreakthroughMitigationSummary`)를 추가해 보정 전/후 성공률·사망위험·위험도 변화를 표준화.
2. [완료] 모바일 UI에 보정 효과 라인(`previewMitigationLabel`, `previewMitigationHint`)을 추가해 효과를 수치로 표시.
3. [완료] 회귀 체크에 보정 효과 요약 시나리오(개선 큼/개선 없음/비도겁)를 추가.

## 193) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(도겁 보정 효과 요약 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 194) 다음 순차 작업
1. [완료] 엔진에 기대값 요약 함수(`resolveBreakthroughExpectedDelta`)를 추가해 1회 돌파 기준 기대 `기/환생정수/경지` 변화를 계산.
2. [완료] 모바일 UI에 기대값 라인(`previewExpectedLabel`, `previewExpectedQiDelta`, `previewExpectedEssenceDelta`, `previewExpectedDifficultyDelta`)을 추가.
3. [완료] 회귀 체크에 기대값 시나리오(도겁 vs 비도겁 구간 기대 재화/경지 변화) 검증을 추가.

## 195) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(도겁 기대값 요약 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 196) 다음 순차 작업
1. [완료] 엔진에 수동 돌파 시도 확인 정책 함수(`resolveBreakthroughManualAttemptPolicy`)를 추가해 위험도/기대 기소모 기준 확인 필요 여부를 표준화.
2. [완료] 모바일 UI 수동 돌파 버튼 경로에 고위험/고기소모 확인 모달을 연동해 취소 시 시도를 중단하도록 개선.
3. [완료] 모바일 회귀 체크에 수동 시도 확인 정책 시나리오(치명/위험/고기소모/안전) 검증을 추가.

## 197) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(수동 도겁 시도 확인 정책 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 198) 다음 순차 작업
1. [완료] 엔진에 자동 돌파 차단 정책 함수(`resolveBreakthroughAutoAttemptPolicy`)를 추가해 고위험/고기소모 도겁의 자동 시도를 차단.
2. [완료] 자동 루프(`runAutoSliceSeconds`)에 정책 적용 및 차단 카운트(`breakthroughPolicyBlocks`) 집계를 추가.
3. [완료] 모바일 회귀 체크에 자동 돌파 차단 시나리오(고위험 도겁 구간 block + 이벤트 기록)를 추가.

## 199) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(자동 도겁 위험 차단 정책 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 200) 다음 순차 작업
1. [완료] 자동 도겁 차단 정책 결과에 사유 라벨/후속 액션(`reasonLabelKo`, `nextActionKo`)을 포함해 복구 가이드를 표준화.
2. [완료] 자동 10초/실시간/오프라인 정산 상태 문구에 차단 사유 집계(`치명/고위험/고기소모`)를 함께 노출.
3. [완료] 모바일 회귀 체크에 자동 차단 결과 가이드 필드 및 사유 카운트 합 일치 검증을 추가.

## 201) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(자동 도겁 차단 사유 집계/가이드 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 202) 다음 순차 작업
1. [완료] 자동 루프에 연속 정책 차단 임계치(`autoBreakthroughPausePolicyBlockThreshold`, 기본 3회) 기반 안전 정지 래치를 추가.
2. [완료] 임계치 도달 시 `autoBreakthrough=false`로 전환하고 요약/이벤트(`auto_breakthrough_paused_by_policy`)에 중단 사유를 기록.
3. [완료] 모바일 회귀 체크에 연속 차단 후 자동 돌파 일시정지 발동 시나리오를 추가.

## 203) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(자동 도겁 안전 정지 래치 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 204) 다음 순차 작업
1. [완료] 자동 재개 정책 함수(`resolveAutoBreakthroughResumePolicy`)를 추가해 상태별 재개 가능 여부/권장 액션을 표준화.
2. [완료] 모바일 UI에 자동 재개 가이드/원클릭 버튼(`autoBreakthroughResume*`, `btnResumeAutoBreakthrough`)을 추가해 자동 돌파 복구 UX를 제공.
3. [완료] 모바일 회귀 체크에 자동 재개 정책 시나리오(재개 가능/이미 진행 중/재개 보류/도겁 허용 필요) 검증을 추가.

## 205) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(자동 도겁 재개 UX 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 206) 다음 순차 작업
1. [완료] 자동 재개 정책 결과 기반 확인 정책 함수(`resolveAutoBreakthroughResumeConfirmPolicy`)를 추가해 도겁 단계 재개 전 확인 필요 여부를 표준화.
2. [완료] 모바일 UI `자동 돌파 재개` 버튼 경로에 확인 모달(위험도/사망률/기대값/도겁 허용 전환 안내)을 연동.
3. [완료] 모바일 회귀 체크에 자동 재개 확인 정책 시나리오(비도겁/도겁 재개/도겁 허용 동반/비액션) 검증을 추가.

## 207) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(자동 도겁 재개 확인 모달 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 208) 다음 순차 작업
1. [완료] 자동 재개 확인 모달용 권장 적용 계획 함수(`resolveAutoBreakthroughResumeRecommendationPlan`)를 추가해 적용 여부/대상 토글/결손 자원을 표준화.
2. [완료] 모바일 UI `자동 돌파 재개` 경로에서 확인 시 권장 설정(영약/수호부)을 원클릭으로 자동 반영하도록 연동.
3. [완료] 모바일 회귀 체크에 자동 재개 권장 적용 정책 시나리오(확인 필요 경로만 자동 적용, 보유 없음 경고, 변경 없음) 검증을 추가.

## 209) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(자동 도겁 재개 권장 설정 원클릭 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 210) 다음 순차 작업
1. [완료] 자동 루프에 워밍업 가드 옵션(`autoBreakthroughWarmupUntilSec`)을 추가해 재개 직후 지정 구간의 자동 돌파 시도를 지연.
2. [완료] 모바일 UI `자동 돌파 재개` 경로에서 워밍업 타이머(기본 6초)를 설정하고 실시간 상태 라인에 잔여 시간을 노출.
3. [완료] 모바일 회귀 체크에 워밍업 가드 시나리오(초기 구간 skip/타임라인 오프셋 잔여시간 계산) 검증을 추가.

## 211) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(자동 도겁 재개 워밍업 가드 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 212) 다음 순차 작업
1. [완료] 자동 재개 워밍업 시간을 설정값(`autoBreakthroughResumeWarmupSec`, 0~30, 기본 6)으로 승격하고 초기 상태/파싱 경로에 공통 반영.
2. [완료] 모바일 UI 자동 옵션 패널에 워밍업 시간 입력(`optAutoBreakthroughResumeWarmupSec`)을 추가하고 변경 시 즉시 저장/렌더 연동.
3. [완료] 모바일 회귀/DOM 체크에 워밍업 옵션 초기 적용·범위 clamp·저장 roundtrip 시나리오를 추가.

## 213) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(자동 재개 워밍업 옵션화 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 214) 다음 순차 작업
1. [완료] 워밍업 잔여시간 감소 헬퍼(`resolveAutoBreakthroughWarmupRemainingSec`)를 엔진 순수 함수로 추가.
2. [완료] 모바일 UI `자동 10초 진행` 경로가 워밍업 잔여시간을 반영해 자동 돌파 skip/잔여 차감을 일관되게 적용하도록 연동.
3. [완료] 모바일 회귀 체크에 워밍업 잔여시간 clamp 시나리오를 추가.

## 215) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(자동 10초 진행 워밍업 정렬 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 216) 다음 순차 작업
1. [완료] 엔진 오프라인 정산(`runOfflineCatchup`)에 워밍업 가드 입력(`autoBreakthroughWarmupUntilSec`)을 연동.
2. [완료] 앱 오프라인 정산 경로(`applyOfflineCatchupNow`)가 워밍업 잔여를 정산 전/후 동기화하도록 개선.
3. [완료] 모바일 회귀 체크에 오프라인 정산 워밍업 가드/잔여시간 시나리오를 추가.

## 217) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 정산 워밍업 동기화 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 218) 다음 순차 작업
1. [완료] 오프라인 정산 summary에 워밍업 메타(`autoBreakthroughWarmupRemainingSecBefore/After`)를 추가.
2. [완료] 앱 오프라인 정산 동기화 경로가 summary 메타를 단일 소스로 사용하도록 정리.
3. [완료] 모바일 회귀 체크에 오프라인 워밍업 메타(0초/부분 경과/소진) 시나리오를 추가.

## 219) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 워밍업 summary 메타 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 220) 다음 순차 작업
1. [완료] 엔진에 오프라인 워밍업 텔레메트리 헬퍼(`resolveOfflineWarmupTelemetry`)를 추가해 before/after/consumed/skippedAttempts를 표준화.
2. [완료] 앱 오프라인 정산 경로/상태 문구/리포트가 텔레메트리 헬퍼를 공통 사용하도록 정리.
3. [완료] 모바일 회귀 체크에 오프라인 워밍업 텔레메트리 정규화 시나리오를 추가.

## 221) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 워밍업 텔레메트리 표준화 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 222) 다음 순차 작업
1. [완료] 엔진에 오프라인 워밍업 라벨 헬퍼(`buildOfflineWarmupTelemetryLabelKo`)를 추가해 사용자 문구를 표준화.
2. [완료] 오프라인 모달 UI에 워밍업 요약 라인(`offlineWarmupSummary`)을 추가하고 상태/리포트가 동일 라벨을 사용하도록 정리.
3. [완료] 모바일 회귀/DOM 체크에 오프라인 워밍업 라벨/모달 ID 계약 시나리오를 추가.

## 223) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 워밍업 요약 라벨/모달 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 224) 다음 순차 작업
1. [완료] 오프라인 정산 수집 이벤트에 워밍업 요약 이벤트(`offline_warmup_summary`)를 추가.
2. [완료] 앱 오프라인 세부 로그 렌더러가 워밍업 요약 이벤트를 한국어 라벨로 표시하도록 확장.
3. [완료] 모바일 회귀 체크에 워밍업 요약 이벤트 생성/비생성 조건 시나리오를 추가.

## 225) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 워밍업 요약 이벤트 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 226) 다음 순차 작업
1. [완료] 오프라인 상세 로그 정렬 헬퍼(`prioritizeOfflineDetailEvents`)를 추가해 워밍업 요약 이벤트를 상단 우선 배치.
2. [완료] 앱 오프라인 세부 로그 렌더링이 정렬 헬퍼를 공통 사용하도록 반영.
3. [완료] 모바일 회귀 체크에 오프라인 상세 로그 우선 정렬 시나리오를 추가.

## 227) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 상세 로그 워밍업 요약 우선 정렬 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 228) 다음 순차 작업
1. [완료] 오프라인 상세 로그 우선순위를 확장해 핵심 이벤트(`워밍업 요약 > 자동 돌파 일시정지 > 도겁 사망 > 기타`)를 상단 배치.
2. [완료] 앱 세부 로그 렌더링은 기존 공통 정렬 헬퍼를 그대로 사용해 UI 변경 없이 우선순위 개선이 반영되도록 유지.
3. [완료] 모바일 회귀 체크에 우선순위 유지 및 동일 우선순위 내 입력 순서 보존 시나리오를 추가.

## 229) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 상세 로그 핵심 이벤트 우선순위 확장 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 230) 다음 순차 작업
1. [완료] 오프라인 세부 로그 핵심 이벤트 카운트 헬퍼(`summarizeOfflineDetailCriticalEvents`)와 요약 라벨 헬퍼(`buildOfflineDetailCriticalSummaryLabelKo`)를 추가.
2. [완료] 오프라인 모달에 핵심 이벤트 요약 라인(`offlineCriticalSummary`)을 추가해 워밍업/일시정지/사망 건수를 즉시 노출.
3. [완료] 모바일 회귀/DOM 체크에 핵심 이벤트 요약 헬퍼 및 신규 모달 ID 계약 시나리오를 추가.

## 231) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 핵심 이벤트 요약 라벨/모달 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 232) 다음 순차 작업
1. [완료] 오프라인 상세 로그 필터 헬퍼(`filterOfflineDetailEventsByMode`)를 추가해 `all/critical` 모드를 표준화.
2. [완료] 오프라인 모달에 `핵심 로그만 보기` 토글(`btnToggleOfflineCriticalOnly`)을 추가해 세부 로그 모드를 즉시 전환.
3. [완료] 모바일 회귀/DOM 체크에 오프라인 상세 로그 필터 모드 및 신규 버튼 ID 계약 시나리오를 추가.

## 233) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 상세 로그 핵심 필터 토글 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 234) 다음 순차 작업
1. [완료] 오프라인 상세 로그 필터 요약 헬퍼(`summarizeOfflineDetailFilterResult`, `buildOfflineDetailFilterSummaryLabelKo`)를 추가.
2. [완료] 오프라인 모달에 필터 요약 라인(`offlineDetailFilterSummary`)을 추가해 현재 모드의 표시 건수를 실시간 노출.
3. [완료] 모바일 회귀/DOM 체크에 필터 요약 헬퍼 및 신규 요약 라인 ID 계약 시나리오를 추가.

## 235) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 상세 로그 필터 요약 라벨 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 236) 다음 순차 작업
1. [완료] 오프라인 상세 로그 숨김 요약 라벨 헬퍼(`buildOfflineDetailHiddenSummaryLabelKo`)를 추가.
2. [완료] 오프라인 모달에 숨김 요약 라인(`offlineDetailHiddenSummary`)을 추가해 필터로 가려진 비핵심 로그 수를 즉시 노출.
3. [완료] 모바일 회귀/DOM 체크에 숨김 요약 라벨 헬퍼 및 신규 요약 라인 ID 계약 시나리오를 추가.

## 237) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 상세 로그 숨김 요약 라벨 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 238) 다음 순차 작업
1. [완료] 오프라인 상세 로그 숨김 구성 집계 헬퍼(`summarizeOfflineDetailHiddenKinds`)와 라벨 헬퍼(`buildOfflineDetailHiddenKindsSummaryLabelKo`)를 추가.
2. [완료] 오프라인 모달에 숨김 상세 구성 라인(`offlineDetailHiddenKindsSummary`)을 추가해 핵심 모드에서 가려진 로그 종류를 즉시 노출.
3. [완료] 모바일 회귀/DOM 체크에 숨김 구성 요약 헬퍼 및 신규 요약 라인 ID 계약 시나리오를 추가.

## 239) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 상세 로그 숨김 구성 요약 라벨 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 240) 다음 순차 작업
1. [완료] 오프라인 상세 로그 리포트 스냅샷 헬퍼(`buildOfflineDetailReportSnapshot`)를 추가해 필터 집계/라벨/숨김 상위 종류를 구조화.
2. [완료] 앱 오프라인 JSON 리포트(`lastOfflineReport`)에 `detailReportSnapshot`을 포함해 내보내기 분석 정보를 강화.
3. [완료] 모바일 회귀 체크에 오프라인 리포트 스냅샷 집계/라벨/숨김 상위 종류 검증 시나리오를 추가.

## 241) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 상세 로그 리포트 스냅샷 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 242) 다음 순차 작업
1. [완료] 오프라인 리포트 스냅샷 헬퍼(`buildOfflineDetailReportSnapshot`)를 확장해 내보내기 view 모드(`all/critical`)의 표시/숨김 메타를 포함.
2. [완료] 오프라인 JSON 내보내기 경로가 내보내기 시점 스냅샷(`detailViewSnapshotAtExport`)과 `exportedAtIso`를 함께 기록하도록 반영.
3. [완료] 모바일 회귀 체크에 리포트 스냅샷 view 모드 메타(라벨/표시·숨김 건수) 검증 시나리오를 추가.

## 243) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 상세 로그 내보내기 view 스냅샷 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 244) 다음 순차 작업
1. [완료] 오프라인 이벤트 종류 digest 헬퍼(`buildOfflineDetailKindDigest`)를 추가해 `kind:count` signature와 상위 종류 집계를 표준화.
2. [완료] 오프라인 리포트 스냅샷(`buildOfflineDetailReportSnapshot`)에 종류 digest(`all/view`)를 포함해 내보내기 비교 가능성을 강화.
3. [완료] 모바일 회귀 체크에 종류 digest signature 안정성 및 리포트 스냅샷 digest(view 포함) 검증 시나리오를 추가.

## 245) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 상세 로그 종류 digest 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 246) 다음 순차 작업
1. [완료] 오프라인 비교 코드 헬퍼(`buildOfflineDetailCompareCode`)를 추가해 모드/핵심 집계/checksum 기반 비교 코드를 표준화.
2. [완료] 오프라인 모달에 비교 코드 라인(`offlineDetailCompareCode`)을 추가하고 필터 모드 전환 시 즉시 갱신되도록 연동.
3. [완료] 오프라인 리포트 스냅샷(`detailReportSnapshot`, `detailViewSnapshotAtExport`)에 `compareCode`를 포함하고 회귀/DOM 체크를 확장.

## 247) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 상세 로그 비교 코드 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 248) 다음 순차 작업
1. [완료] 오프라인 비교 코드 검증 헬퍼(`isOfflineDetailCompareCode`)를 추가해 코드 포맷을 표준 검증.
2. [완료] 오프라인 모달 액션에 비교 코드 복사 버튼(`btnCopyOfflineCompareCode`)을 추가하고 상태 메시지/클립보드 fallback을 연동.
3. [완료] 모바일 회귀/DOM 체크에 비교 코드 검증 헬퍼와 신규 버튼 ID 계약 시나리오를 추가.

## 249) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 코드 복사 액션 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 250) 다음 순차 작업
1. [완료] 오프라인 비교 코드 파싱/차이 요약 헬퍼(`parseOfflineDetailCompareCode`, `resolveOfflineDetailCompareCodeDiff`, `buildOfflineDetailCompareResultLabelKo`)를 추가.
2. [완료] 오프라인 모달에 비교 코드 입력/대조 액션(`offlineCompareCodeInput`, `btnCompareOfflineCode`, `offlineCompareCodeResult`)을 추가.
3. [완료] 모바일 회귀/DOM 체크에 비교 코드 파싱·차이 요약 헬퍼 및 신규 입력/버튼/결과 ID 계약 시나리오를 추가.

## 251) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 코드 대조 액션 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 252) 다음 순차 작업
1. [완료] 비교 코드 추출 헬퍼(`extractOfflineDetailCompareCode`)를 추가해 문장/JSON 텍스트에서도 ODR1 코드를 인식.
2. [완료] 오프라인 모달에 비교 코드 붙여넣기 버튼(`btnPasteOfflineCompareCode`)을 추가하고 클립보드 읽기 후 즉시 대조 흐름을 연동.
3. [완료] 모바일 회귀/DOM 체크에 비교 코드 추출 헬퍼 및 신규 붙여넣기 버튼 ID 계약 시나리오를 추가.

## 253) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 코드 붙여넣기 액션 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 254) 다음 순차 작업
1. [완료] payload 전용 비교 코드 추출 헬퍼(`extractOfflineDetailCompareCodeFromPayloadText`)를 추가해 `detailViewSnapshotAtExport`/`detailReportSnapshot` 우선순위를 표준화.
2. [완료] 오프라인 모달에 `savePayload` 기반 비교 코드 대조 버튼(`btnLoadOfflineCompareCodeFromPayload`)을 추가하고 즉시 비교 흐름을 연동.
3. [완료] 모바일 회귀/DOM 체크에 payload 추출 헬퍼 및 신규 버튼 ID 계약 시나리오를 추가.

## 255) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(`savePayload` 기반 오프라인 비교 코드 대조 액션 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 256) 다음 순차 작업
1. [완료] payload 비교 코드 추출 헬퍼를 확장(`extractOfflineDetailCompareCodeFromPayloadTextWithSource`)해 코드와 추출 출처를 함께 반환.
2. [완료] `savePayload` 기반 비교 코드 대조 경로에서 상태 메시지에 추출 출처(`detailView/detailReport/text`)를 포함해 디버깅 가시성을 강화.
3. [완료] 모바일 회귀 체크에 payload 비교 코드 출처 분기 안정성 시나리오를 추가.

## 257) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(`savePayload` 기반 비교 코드 추출 출처 메타 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 258) 다음 순차 작업
1. [완료] 비교 코드 출처 라벨 헬퍼(`buildOfflineDetailCompareCodeSourceLabelKo`)를 추가해 source key별 표시 문구를 표준화.
2. [완료] 오프라인 모달에 비교 코드 출처 라인(`offlineCompareCodeSource`)을 추가해 입력/클립보드/savePayload 경로를 상시 표시.
3. [완료] 모바일 회귀/DOM 체크에 출처 라벨 헬퍼 및 신규 출처 라인 ID 계약 시나리오를 추가.

## 259) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 코드 출처 라인 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 260) 다음 순차 작업
1. [완료] 비교 코드 대상 요약 라벨 헬퍼(`buildOfflineDetailCompareCodeTargetSummaryLabelKo`)를 추가해 빈 입력/형식 오류/전체·핵심 보기 요약 문구를 표준화.
2. [완료] 오프라인 모달에 대상 요약 라인(`offlineCompareCodeTargetSummary`)을 추가해 대상 코드 집계(총/핵심표시/숨김/보기)를 상시 노출.
3. [완료] 모바일 회귀/DOM 체크에 대상 요약 라벨 헬퍼 및 신규 요약 라인 ID 계약 시나리오를 추가.

## 261) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 코드 대상 요약 라인 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 262) 다음 순차 작업
1. [완료] 비교 코드 현재 요약 라벨 헬퍼(`buildOfflineDetailCompareCodeCurrentSummaryLabelKo`)를 추가해 빈 입력/형식 오류/전체·핵심 보기 요약 문구를 표준화.
2. [완료] 오프라인 모달에 현재 요약 라인(`offlineCompareCodeCurrentSummary`)을 추가해 기준 코드 집계(총/핵심표시/숨김/보기)를 상시 노출.
3. [완료] 모바일 회귀/DOM 체크에 현재 요약 라벨 헬퍼 및 신규 요약 라인 ID 계약 시나리오를 추가.

## 263) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 코드 현재 요약 라인 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 264) 다음 순차 작업
1. [완료] 비교 코드 차이 요약 라벨 헬퍼(`buildOfflineDetailCompareCodeDeltaSummaryLabelKo`)를 추가해 대상 없음/형식 오류/일치/보기 차이 케이스 문구를 표준화.
2. [완료] 오프라인 모달에 차이 요약 라인(`offlineCompareCodeDeltaSummary`)을 추가해 대상-기준 변화량과 보기/checksum 차이를 상시 노출.
3. [완료] 모바일 회귀/DOM 체크에 차이 요약 라벨 헬퍼 및 신규 요약 라인 ID 계약 시나리오를 추가.

## 265) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 코드 차이 요약 라인 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 266) 다음 순차 작업
1. [완료] 비교 코드 일치 요약 라벨 헬퍼(`buildOfflineDetailCompareCodeMatchSummaryLabelKo`)를 추가해 대상 없음/형식 오류/일치·불일치 조합 문구를 표준화.
2. [완료] 오프라인 모달에 일치 요약 라인(`offlineCompareCodeMatchSummary`)을 추가해 항목별 일치 상태(총/핵심표시/숨김/보기/checksum)를 상시 노출.
3. [완료] 모바일 회귀/DOM 체크에 일치 요약 라벨 헬퍼 및 신규 요약 라인 ID 계약 시나리오를 추가.

## 267) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 코드 일치 요약 라인 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 268) 다음 순차 작업
1. [완료] 비교 결과 상태 라벨 헬퍼(`buildOfflineDetailCompareResultStateLabelKo`)를 추가해 대기/입력 필요/일치/보기 차이/현재 코드 없음 케이스를 표준화.
2. [완료] 기준 코드 리렌더 시 비교 결과 라인(`offlineCompareCodeResult`)을 입력값 기준으로 즉시 재계산해 stale 결과를 제거.
3. [완료] 모바일 회귀 체크에 비교 결과 상태 라벨 헬퍼 시나리오를 추가.

## 269) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 결과 상태 라인 동기화 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 270) 다음 순차 작업
1. [완료] 오프라인 비교 가이드 라벨 헬퍼(`buildOfflineDetailCompareActionHintLabelKo`)를 추가해 입력 필요/형식 오류/현재 코드 없음/일치/보기 모드 차이/checksum·집계 차이 분기를 표준화.
2. [완료] 오프라인 모달에 비교 가이드 라인(`offlineCompareCodeActionHint`)을 추가하고 입력/붙여넣기/savePayload/모달 open·close 경로에서 상태를 즉시 동기화.
3. [완료] 모바일 회귀/DOM 체크에 비교 가이드 라벨 헬퍼 및 신규 가이드 라인 ID 계약 시나리오를 추가.

## 271) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 가이드 라인 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 272) 다음 순차 작업
1. [완료] 오프라인 비교 가이드 톤 헬퍼(`buildOfflineDetailCompareActionHintTone`)를 추가해 상태별(`info/warn/error`) 우선순위를 표준화.
2. [완료] 오프라인 모달 가이드 라인(`offlineCompareCodeActionHint`)에 톤 클래스를 연동해 입력/붙여넣기/savePayload/모달 open·close 경로에서 라벨+톤을 함께 즉시 동기화.
3. [완료] 모바일 회귀/DOM 체크에 가이드 톤 시나리오 및 스타일 계약(`.offline-compare-action-hint.tone-error`) 검증을 추가.

## 273) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 가이드 라인 톤 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 274) 다음 순차 작업
1. [완료] 오프라인 비교 보기 모드 정렬 타깃 헬퍼(`resolveOfflineDetailCompareViewModeAlignmentTarget`)를 추가해 `view-only mismatch` 조건을 표준화.
2. [완료] 오프라인 모달에 보기 모드 정렬 버튼(`btnApplyOfflineCompareViewMode`)을 추가하고 대상 모드(전체/핵심) 자동 라벨/활성 조건을 연동.
3. [완료] 모바일 회귀/DOM 체크에 보기 모드 정렬 타깃 시나리오 및 신규 버튼 ID 계약 검증을 추가.

## 275) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 보기 모드 정렬 버튼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 276) 다음 순차 작업
1. [완료] 오프라인 비교 결과 톤 헬퍼(`buildOfflineDetailCompareResultStateTone`)를 추가해 대기/형식 오류/현재 코드 없음/일치/불일치 상태를 `info/warn/error`로 표준화.
2. [완료] 오프라인 모달 비교 결과 라인(`offlineCompareCodeResult`)에 톤 클래스를 연동해 입력/붙여넣기/savePayload/모달 open·close 경로에서 라벨+톤을 함께 즉시 동기화.
3. [완료] 모바일 회귀/DOM 체크에 결과 톤 시나리오 및 스타일 계약(`.offline-compare-result.tone-error`) 검증을 추가.

## 277) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 결과 라인 톤 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 278) 다음 순차 작업
1. [완료] 오프라인 비교 차이 요약 톤 헬퍼(`buildOfflineDetailCompareCodeDeltaSummaryTone`)를 추가해 대기/형식 오류/보기 차이/checksum·집계 차이를 `info/warn/error`로 표준화.
2. [완료] 오프라인 모달 차이 요약 라인(`offlineCompareCodeDeltaSummary`)에 톤 클래스를 연동해 입력/붙여넣기/savePayload/모달 open·close 경로에서 라벨+톤을 함께 즉시 동기화.
3. [완료] 모바일 회귀/DOM 체크에 차이 요약 톤 시나리오 및 스타일 계약(`.offline-compare-delta-summary.tone-error`) 검증을 추가.

## 279) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 차이 요약 라인 톤 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 280) 다음 순차 작업
1. [완료] 오프라인 비교 일치 요약 톤 헬퍼(`buildOfflineDetailCompareCodeMatchSummaryTone`)를 추가해 대기/형식 오류/보기 차이/checksum·집계 차이를 `info/warn/error`로 표준화.
2. [완료] 오프라인 모달 일치 요약 라인(`offlineCompareCodeMatchSummary`)에 톤 클래스를 연동해 입력/붙여넣기/savePayload/모달 open·close 경로에서 라벨+톤을 함께 즉시 동기화.
3. [완료] 모바일 회귀/DOM 체크에 일치 요약 톤 시나리오 및 스타일 계약(`.offline-compare-match-summary.tone-error`) 검증을 추가.

## 281) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 일치 요약 라인 톤 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 282) 다음 순차 작업
1. [완료] 오프라인 비교 출처 톤 헬퍼(`buildOfflineDetailCompareCodeSourceTone`)를 추가해 source key별(`info/warn/error`) 신뢰도 분기를 표준화.
2. [완료] 오프라인 모달 출처 라인(`offlineCompareCodeSource`)에 톤 클래스를 연동해 입력/클립보드/savePayload/모달 open·close 경로에서 라벨+톤을 함께 즉시 동기화.
3. [완료] 모바일 회귀/DOM 체크에 출처 톤 시나리오 및 스타일 계약(`.offline-compare-source.tone-error`) 검증을 추가.

## 283) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 출처 라인 톤 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 284) 다음 순차 작업
1. [완료] 비교 코드 대상 요약 톤 헬퍼(`buildOfflineDetailCompareCodeTargetSummaryTone`)를 추가해 빈 입력/형식 오류/정상 입력 상태를 `info/warn`으로 표준화.
2. [완료] 오프라인 모달 대상 요약 라인(`offlineCompareCodeTargetSummary`)에 톤 클래스를 연동해 입력/붙여넣기/savePayload/모달 open·close 경로에서 라벨+톤을 함께 즉시 동기화.
3. [완료] 모바일 회귀/DOM 체크에 대상 요약 톤 시나리오 및 스타일 계약(`.offline-compare-target-summary.tone-error`) 검증을 추가.

## 285) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 대상 요약 라인 톤 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 286) 다음 순차 작업
1. [완료] 비교 코드 현재 요약 톤 헬퍼(`buildOfflineDetailCompareCodeCurrentSummaryTone`)를 추가해 빈 입력/형식 오류/정상 코드 상태를 `info/warn`으로 표준화.
2. [완료] 오프라인 모달 현재 요약 라인(`offlineCompareCodeCurrentSummary`)에 톤 클래스를 연동해 리렌더/모달 open·close 경로에서 라벨+톤을 함께 즉시 동기화.
3. [완료] 모바일 회귀/DOM 체크에 현재 요약 톤 시나리오 및 스타일 계약(`.offline-compare-current-summary.tone-error`) 검증을 추가.

## 287) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 현재 요약 라인 톤 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 288) 다음 순차 작업
1. [완료] 비교 입력 출처 해석 헬퍼(`resolveOfflineDetailCompareInputSource`)를 추가해 공백 입력은 `none`, 값이 있는 입력은 `input`으로 표준화.
2. [완료] 오프라인 모달 비교 입력 `input` 이벤트에서 출처 라인(`offlineCompareCodeSource`)을 즉시 동기화해 빈 입력 시 `출처: 없음`으로 복원되도록 반영.
3. [완료] 모바일 회귀 체크에 입력 출처 해석 헬퍼 시나리오를 추가해 `none/input` 분기 안정성을 검증.

## 289) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 입력 출처 라인 실시간 동기화 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 290) 다음 순차 작업
1. [완료] 비교 대조 출처 해석 헬퍼(`resolveOfflineDetailCompareCheckSource`)를 추가해 `keep/input/명시 출처` 분기 규칙을 표준화.
2. [완료] 오프라인 모달 비교 대조 기본 동작을 `keep`으로 전환해 버튼/Enter 재실행 시 마지막 확정 출처를 유지하도록 반영.
3. [완료] 모바일 회귀 체크에 비교 대조 출처 해석 헬퍼 시나리오를 추가해 `keep` 유지/입력 fallback/명시 출처 분기 안정성을 검증.

## 291) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 대조 출처 유지 동작 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 292) 다음 순차 작업
1. [완료] 비교 대상 입력 상태 해석 헬퍼(`resolveOfflineDetailCompareTargetInputState`)를 추가해 빈 입력/형식 오류/유효 코드를 `empty/invalid/valid`로 표준화.
2. [완료] 오프라인 모달 비교 대조 실행에서 빈 입력과 형식 오류 상태 메시지를 분리해 `비교 코드 입력 필요`/`비교 코드 형식 오류`를 정확히 안내하도록 반영.
3. [완료] 모바일 회귀 체크에 대상 입력 상태 해석 헬퍼 시나리오를 추가해 `empty/invalid/valid` 분기 안정성을 검증.

## 293) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 대조 상태 메시지 정밀화 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 294) 다음 순차 작업
1. [완료] 비교 상태 라벨 헬퍼(`buildOfflineDetailCompareStatusLabelKo`)를 추가해 출처/메시지를 `[출처] 메시지` 포맷으로 표준화.
2. [완료] 오프라인 모달 비교 대조 실행의 성공/실패(입력 필요/형식 오류) 상태 메시지를 공통 헬퍼로 조합하도록 반영해 출처 컨텍스트를 항상 유지.
3. [완료] 모바일 회귀 체크에 비교 상태 라벨 헬퍼 시나리오를 추가해 source key별 포맷 안정성을 검증.

## 295) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 상태 메시지 출처 포맷 통일 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 296) 다음 순차 작업
1. [완료] 오프라인 비교 추출 실패 경로(클립보드/`savePayload`) 상태 메시지가 `buildOfflineDetailCompareStatusLabelKo`를 사용하도록 정리해 출처 프리픽스를 통일.
2. [완료] 클립보드 읽기 미지원/읽기 실패/코드 인식 실패 및 `savePayload` 입력 필요/코드 인식 실패 케이스에서 `[출처] 메시지` 포맷으로 상태를 즉시 안내하도록 반영.
3. [완료] 모바일 회귀 체크에 추출 실패 메시지 포맷 시나리오를 추가해 source key별 상태 라벨 안정성을 검증.

## 297) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 추출 실패 상태 메시지 출처 포맷 통일 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 298) 다음 순차 작업
1. [완료] 클립보드 실패 메타 헬퍼(`resolveOfflineDetailCompareClipboardFailureInfo`)를 추가해 실패 사유(`unsupported/read_failed/extract_failed`)별 source/message 매핑을 표준화.
2. [완료] 오프라인 모달 클립보드 읽기 미지원/읽기 실패 경로에서 출처 라인(`offlineCompareCodeSource`)을 `클립보드 텍스트`로 즉시 동기화하도록 반영.
3. [완료] 모바일 회귀 체크에 클립보드 실패 메타 헬퍼 시나리오를 추가해 사유별 매핑 안정성을 검증.

## 299) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 클립보드 실패 메타/출처 라인 동기화 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 300) 다음 순차 작업
1. [완료] payload 실패 메타 헬퍼(`resolveOfflineDetailComparePayloadFailureInfo`)를 추가해 실패 사유(`missing_payload/extract_failed`)별 source/message 매핑을 표준화.
2. [완료] 오프라인 모달 `savePayload` 불러오기 실패 경로(입력 없음/코드 인식 실패)가 payload 실패 메타를 사용해 출처 라인/상태 메시지를 일관된 기준으로 갱신하도록 반영.
3. [완료] 모바일 회귀 체크에 payload 실패 메타 헬퍼 시나리오를 추가해 사유별 매핑 안정성을 검증.

## 301) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 payload 실패 메타/실패 경로 상태 동기화 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 302) 다음 순차 작업
1. [완료] payload 성공 출처 정규화 헬퍼(`resolveOfflineDetailComparePayloadLoadSource`)를 추가해 `detail_view_snapshot/detail_report_snapshot/text`는 유지하고 나머지는 `payload`로 fallback 하도록 표준화.
2. [완료] 오프라인 모달 `savePayload` 로드 성공 경로가 추출 source raw 문자열 대신 정규화 헬퍼를 통해 대조 실행 출처를 전달하도록 반영.
3. [완료] 모바일 회귀 체크에 payload 성공 출처 정규화 헬퍼 시나리오를 추가해 source fallback 안정성을 검증.

## 303) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 payload 성공 출처 정규화 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 304) 다음 순차 작업
1. [완료] 대상 입력 상태 메시지 헬퍼(`resolveOfflineDetailCompareTargetInputStateStatusMessageKo`)를 추가해 `empty/invalid` 상태를 상태 문구로 표준화.
2. [완료] 오프라인 모달 비교 대조 실행의 조기 실패 경로가 인라인 ternary 대신 상태 메시지 헬퍼를 사용해 `비교 코드 입력 필요/형식 오류` 문구를 일관되게 구성하도록 반영.
3. [완료] 모바일 회귀 체크에 대상 입력 상태 메시지 헬퍼 시나리오를 추가해 상태별 문구 매핑 안정성을 검증.

## 305) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 대상 입력 상태 메시지 헬퍼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 306) 다음 순차 작업
1. [완료] 비교 결과 오류 판정 헬퍼(`isOfflineDetailCompareResultError`)를 추가해 문자열 includes(`오류/불가`) 의존 없이 comparable 상태 기반으로 오류 여부를 계산하도록 표준화.
2. [완료] 오프라인 모달 비교 대조 실행 상태 갱신이 결과 라벨 문자열 파싱 대신 결과 오류 헬퍼를 사용해 `setStatus(..., isError)`를 일관되게 적용하도록 반영.
3. [완료] 모바일 회귀 체크에 비교 결과 오류 플래그 시나리오를 추가해 일치/보기 차이/입력 오류/현재 코드 없음 케이스에서 오류 판정 안정성을 검증.

## 307) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 결과 오류 판정 헬퍼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 308) 다음 순차 작업
1. [완료] 대상 코드 형식 오류 라벨 헬퍼(`buildOfflineDetailCompareInvalidTargetLabelKo`)를 추가해 비교 대상 추출 실패 문구를 단일 함수로 표준화.
2. [완료] 오프라인 모달 클립보드/`savePayload` 추출 실패 경로가 인라인 문자열 대신 라벨 헬퍼를 사용해 결과 라인을 일관되게 갱신하도록 반영.
3. [완료] 모바일 회귀 체크에 대상 코드 형식 오류 라벨 헬퍼 시나리오를 추가해 대조 실패 경로와 라벨 문구 일치성을 검증.

## 309) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 대상 코드 형식 오류 라벨 헬퍼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 310) 다음 순차 작업
1. [완료] 현재 코드 누락 라벨 헬퍼(`buildOfflineDetailCompareMissingCurrentLabelKo`)를 추가해 현재 비교 코드 부재 시 대조 실패 문구를 단일 함수로 표준화.
2. [완료] 오프라인 비교 결과 라벨 생성이 인라인 문자열 대신 현재 코드 누락 라벨 헬퍼를 사용하도록 반영.
3. [완료] 모바일 회귀 체크에 현재 코드 누락 라벨 헬퍼 시나리오를 추가해 결과 라벨/결과 상태 라벨 경로에서 문구 일치성을 검증.

## 311) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 현재 코드 누락 라벨 헬퍼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 312) 다음 순차 작업
1. [완료] 비교 결과 대기 라벨 헬퍼(`buildOfflineDetailCompareResultPendingLabelKo`)를 추가해 대상 미입력 시 표시 문구를 단일 함수로 표준화.
2. [완료] 오프라인 비교 결과 상태 라벨 생성이 인라인 문자열 대신 대기 라벨 헬퍼를 사용하도록 반영.
3. [완료] 모바일 회귀 체크에 대기 라벨 헬퍼 시나리오를 추가해 결과 상태 라벨 경로에서 문구 일치성을 검증.

## 313) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 결과 대기 라벨 헬퍼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 314) 다음 순차 작업
1. [완료] 비교 결과 입력 필요 라벨 헬퍼(`buildOfflineDetailCompareResultInputRequiredLabelKo`)를 추가해 대상 형식 오류 시 상태 라벨 문구를 단일 함수로 표준화.
2. [완료] 오프라인 비교 결과 상태 라벨 생성이 인라인 문자열 대신 입력 필요 라벨 헬퍼를 사용하도록 반영.
3. [완료] 모바일 회귀 체크에 입력 필요 라벨 헬퍼 시나리오를 추가해 결과 상태 라벨 경로에서 문구 일치성을 검증.

## 315) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 결과 입력 필요 라벨 헬퍼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 316) 다음 순차 작업
1. [완료] 오프라인 비교 가이드 입력 필요 라벨 헬퍼(`buildOfflineDetailCompareActionHintInputRequiredLabelKo`)를 추가해 대상 미입력 안내 문구를 단일 함수로 표준화.
2. [완료] 오프라인 비교 가이드 라벨 생성이 인라인 문자열 대신 입력 필요 라벨 헬퍼를 사용하도록 반영.
3. [완료] 모바일 회귀 체크에 가이드 입력 필요 라벨 헬퍼 시나리오를 추가해 가이드 라벨 경로에서 문구 일치성을 검증.

## 317) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 가이드 입력 필요 라벨 헬퍼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 318) 다음 순차 작업
1. [완료] 오프라인 비교 가이드 대상 형식 오류 라벨 헬퍼(`buildOfflineDetailCompareActionHintInvalidTargetLabelKo`)를 추가해 형식 오류 안내 문구를 단일 함수로 표준화.
2. [완료] 오프라인 비교 가이드 라벨 생성의 대상 형식 오류 분기가 인라인 문자열 대신 형식 오류 라벨 헬퍼를 사용하도록 반영.
3. [완료] 모바일 회귀 체크에 가이드 대상 형식 오류 라벨 헬퍼 시나리오를 추가해 가이드 라벨 경로에서 문구 일치성을 검증.

## 319) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 가이드 대상 형식 오류 라벨 헬퍼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 320) 다음 순차 작업
1. [완료] 오프라인 비교 가이드 현재 코드 누락 라벨 헬퍼(`buildOfflineDetailCompareActionHintMissingCurrentLabelKo`)를 추가해 현재 코드 부재 안내 문구를 단일 함수로 표준화.
2. [완료] 오프라인 비교 가이드 라벨 생성의 현재 코드 부재 분기가 인라인 문자열 대신 현재 코드 누락 라벨 헬퍼를 사용하도록 반영.
3. [완료] 모바일 회귀 체크에 가이드 현재 코드 누락 라벨 헬퍼 시나리오를 추가해 가이드 라벨 경로에서 문구 일치성을 검증.

## 321) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 가이드 현재 코드 누락 라벨 헬퍼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 322) 다음 순차 작업
1. [완료] 오프라인 비교 가이드 일치 라벨 헬퍼(`buildOfflineDetailCompareActionHintIdenticalLabelKo`)를 추가해 완전 일치 안내 문구를 단일 함수로 표준화.
2. [완료] 오프라인 비교 가이드 라벨 생성의 완전 일치 분기가 인라인 문자열 대신 일치 라벨 헬퍼를 사용하도록 반영.
3. [완료] 모바일 회귀 체크에 가이드 일치 라벨 헬퍼 시나리오를 추가해 가이드 라벨 경로에서 문구 일치성을 검증.

## 323) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 가이드 일치 라벨 헬퍼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 324) 다음 순차 작업
1. [완료] 오프라인 비교 가이드 보기 모드 차이 라벨 헬퍼(`buildOfflineDetailCompareActionHintViewMismatchLabelKo`)를 추가해 view mismatch 안내 문구를 단일 함수로 표준화.
2. [완료] 오프라인 비교 가이드 라벨 생성의 view mismatch 분기가 인라인 문자열 대신 보기 모드 차이 라벨 헬퍼를 사용하도록 반영.
3. [완료] 모바일 회귀 체크에 가이드 보기 모드 차이 라벨 헬퍼 시나리오를 추가해 가이드 라벨 경로에서 문구 일치성을 검증.

## 325) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 가이드 보기 모드 차이 라벨 헬퍼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 326) 다음 순차 작업
1. [완료] 오프라인 비교 가이드 checksum 불일치 라벨 헬퍼(`buildOfflineDetailCompareActionHintChecksumMismatchLabelKo`)를 추가해 checksum/view checksum mismatch 안내 문구를 단일 함수로 표준화.
2. [완료] 오프라인 비교 가이드 라벨 생성의 checksum/view checksum mismatch 분기가 인라인 문자열 대신 checksum 불일치 라벨 헬퍼를 사용하도록 반영.
3. [완료] 모바일 회귀 체크에 가이드 checksum 불일치 라벨 헬퍼 시나리오를 추가해 가이드 라벨 경로에서 문구 일치성을 검증.

## 327) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 가이드 checksum 불일치 라벨 헬퍼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 328) 다음 순차 작업
1. [완료] 오프라인 비교 가이드 집계 불일치 라벨 헬퍼(`buildOfflineDetailCompareActionHintAggregateMismatchLabelKo`)를 추가해 집계 불일치 안내 문구를 단일 함수로 표준화.
2. [완료] 오프라인 비교 가이드 라벨 생성의 집계 불일치 분기가 인라인 문자열 대신 집계 불일치 라벨 헬퍼를 사용하도록 반영.
3. [완료] 모바일 회귀 체크에 가이드 집계 불일치 라벨 헬퍼 시나리오를 추가해 가이드 라벨 경로에서 문구 일치성을 검증.

## 329) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 가이드 집계 불일치 라벨 헬퍼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 330) 다음 순차 작업
1. [완료] 오프라인 비교 결과 일치 라벨 헬퍼(`buildOfflineDetailCompareResultIdenticalLabelKo`)를 추가해 완전 일치 결과 문구를 단일 함수로 표준화.
2. [완료] 오프라인 비교 결과 라벨/결과 상태 라벨 경로의 완전 일치 분기가 인라인 문자열 대신 결과 일치 라벨 헬퍼를 사용하도록 반영.
3. [완료] 모바일 회귀 체크에 결과 일치 라벨 헬퍼 시나리오를 추가해 결과 라벨 경로에서 문구 일치성을 검증.

## 331) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 결과 일치 라벨 헬퍼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 332) 다음 순차 작업
1. [완료] 오프라인 비교 결과 보기 모드 차이 라벨 헬퍼(`buildOfflineDetailCompareResultViewMismatchLabelKo`)를 추가해 view mismatch 결과 문구를 단일 함수로 표준화.
2. [완료] 오프라인 비교 결과 라벨/결과 상태 라벨 경로의 view mismatch 분기가 인라인 문자열 대신 보기 모드 차이 라벨 헬퍼를 사용하도록 반영.
3. [완료] 모바일 회귀 체크에 결과 보기 모드 차이 라벨 헬퍼 시나리오를 추가해 결과 라벨 경로에서 문구 일치성을 검증.

## 333) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 결과 보기 모드 차이 라벨 헬퍼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 334) 다음 순차 작업
1. [완료] 오프라인 비교 결과 집계 불일치 라벨 헬퍼(`buildOfflineDetailCompareResultAggregateMismatchLabelKo`)를 추가해 checksum/집계 불일치 결과 문구를 단일 함수로 표준화.
2. [완료] 오프라인 비교 결과 라벨 경로의 checksum/집계 불일치 분기가 인라인 문자열 대신 집계 불일치 라벨 헬퍼를 사용하도록 반영.
3. [완료] 모바일 회귀 체크에 결과 집계 불일치 라벨 헬퍼 시나리오를 추가해 결과 라벨 경로에서 문구 일치성을 검증.

## 335) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 결과 집계 불일치 라벨 헬퍼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 336) 다음 순차 작업
1. [완료] 오프라인 비교 결과 코드 차이 감지 라벨 헬퍼(`buildOfflineDetailCompareResultCodeDifferenceLabelKo`)를 추가해 fallback 결과 문구를 단일 함수로 표준화.
2. [완료] 오프라인 비교 결과 라벨 경로의 fallback 분기가 인라인 문자열 대신 코드 차이 감지 라벨 헬퍼를 사용하도록 반영.
3. [완료] 모바일 회귀 체크에 의미 동일 코드(0패딩 표기 차이) 시나리오를 추가해 fallback 결과 라벨 경로에서 문구 일치성을 검증.

## 337) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 결과 코드 차이 감지 라벨 헬퍼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 338) 다음 순차 작업
1. [완료] 오프라인 비교 코드 차이 요약 fallback 라벨 헬퍼(`buildOfflineDetailCompareCodeDeltaSummaryCodeDifferenceLabelKo`)를 추가해 fallback 문구를 단일 함수로 표준화.
2. [완료] 오프라인 비교 코드 차이 요약 라벨 경로의 fallback 분기가 인라인 문자열 대신 fallback 라벨 헬퍼를 사용하도록 반영.
3. [완료] 모바일 회귀 체크에 의미 동일 코드(0패딩 표기 차이) 시나리오를 추가해 차이 요약 fallback 라벨 경로에서 문구 일치성을 검증.

## 339) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 코드 차이 요약 fallback 라벨 헬퍼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 340) 다음 순차 작업
1. [완료] 오프라인 비교 코드 차이 요약 대상 없음 라벨 헬퍼(`buildOfflineDetailCompareCodeDeltaSummaryTargetMissingLabelKo`)를 추가해 대상 미입력 fallback 문구를 단일 함수로 표준화.
2. [완료] 오프라인 비교 코드 차이 요약 라벨 경로의 대상 미입력 분기가 인라인 문자열 대신 대상 없음 라벨 헬퍼를 사용하도록 반영.
3. [완료] 모바일 회귀 체크에 대상 없음 라벨 헬퍼 시나리오를 추가해 차이 요약 라벨 경로에서 문구 일치성을 검증.

## 341) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 코드 차이 요약 대상 없음 라벨 헬퍼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 342) 다음 순차 작업
1. [완료] 오프라인 비교 코드 차이 요약 현재 코드 없음 라벨 헬퍼(`buildOfflineDetailCompareCodeDeltaSummaryCurrentMissingLabelKo`)를 추가해 현재 코드 부재 fallback 문구를 단일 함수로 표준화.
2. [완료] 오프라인 비교 코드 차이 요약 라벨 경로의 현재 코드 부재 분기가 인라인 문자열 대신 현재 코드 없음 라벨 헬퍼를 사용하도록 반영.
3. [완료] 모바일 회귀 체크에 현재 코드 없음 라벨 헬퍼 시나리오를 추가해 차이 요약 라벨 경로에서 문구 일치성을 검증.

## 343) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 코드 차이 요약 현재 코드 없음 라벨 헬퍼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 344) 다음 순차 작업
1. [완료] 오프라인 비교 코드 차이 요약 대상 형식 오류 라벨 헬퍼(`buildOfflineDetailCompareCodeDeltaSummaryInvalidTargetLabelKo`)를 추가해 대상 코드 형식 오류 fallback 문구를 단일 함수로 표준화.
2. [완료] 오프라인 비교 코드 차이 요약 라벨 경로의 대상 코드 형식 오류 분기가 인라인 문자열 대신 대상 형식 오류 라벨 헬퍼를 사용하도록 반영.
3. [완료] 모바일 회귀 체크에 대상 형식 오류 라벨 헬퍼 시나리오를 추가해 차이 요약 라벨 경로에서 문구 일치성을 검증.

## 345) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 코드 차이 요약 대상 형식 오류 라벨 헬퍼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 346) 다음 순차 작업
1. [완료] 오프라인 비교 코드 차이 요약 차이 없음 라벨 헬퍼(`buildOfflineDetailCompareCodeDeltaSummaryNoDifferenceLabelKo`)를 추가해 완전 일치 fallback 문구를 단일 함수로 표준화.
2. [완료] 오프라인 비교 코드 차이 요약 라벨 경로의 완전 일치 분기가 인라인 문자열 대신 차이 없음 라벨 헬퍼를 사용하도록 반영.
3. [완료] 모바일 회귀 체크에 차이 없음 라벨 헬퍼 시나리오를 추가해 차이 요약 라벨 경로에서 문구 일치성을 검증.

## 347) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 코드 차이 요약 차이 없음 라벨 헬퍼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 348) 다음 순차 작업
1. [완료] 오프라인 비교 코드 일치 요약 대상 없음 라벨 헬퍼(`buildOfflineDetailCompareCodeMatchSummaryTargetMissingLabelKo`)를 추가해 대상 미입력 fallback 문구를 단일 함수로 표준화.
2. [완료] 오프라인 비교 코드 일치 요약 라벨 경로의 대상 미입력 분기가 인라인 문자열 대신 대상 없음 라벨 헬퍼를 사용하도록 반영.
3. [완료] 모바일 회귀 체크에 대상 없음 라벨 헬퍼 시나리오를 추가해 일치 요약 라벨 경로에서 문구 일치성을 검증.

## 349) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 코드 일치 요약 대상 없음 라벨 헬퍼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 350) 다음 순차 작업
1. [완료] 오프라인 비교 코드 일치 요약 현재 코드 없음 라벨 헬퍼(`buildOfflineDetailCompareCodeMatchSummaryCurrentMissingLabelKo`)를 추가해 현재 코드 부재 fallback 문구를 단일 함수로 표준화.
2. [완료] 오프라인 비교 코드 일치 요약 라벨 경로의 현재 코드 부재 분기가 인라인 문자열 대신 현재 코드 없음 라벨 헬퍼를 사용하도록 반영.
3. [완료] 모바일 회귀 체크에 현재 코드 없음 라벨 헬퍼 시나리오를 추가해 일치 요약 라벨 경로에서 문구 일치성을 검증.

## 351) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 코드 일치 요약 현재 코드 없음 라벨 헬퍼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 352) 다음 순차 작업
1. [완료] 오프라인 비교 코드 일치 요약 대상 형식 오류 라벨 헬퍼(`buildOfflineDetailCompareCodeMatchSummaryInvalidTargetLabelKo`)를 추가해 대상 코드 형식 오류 fallback 문구를 단일 함수로 표준화.
2. [완료] 오프라인 비교 코드 일치 요약 라벨 경로의 대상 코드 형식 오류 분기가 인라인 문자열 대신 대상 형식 오류 라벨 헬퍼를 사용하도록 반영.
3. [완료] 모바일 회귀 체크에 대상 형식 오류 라벨 헬퍼 시나리오를 추가해 일치 요약 라벨 경로에서 문구 일치성을 검증.

## 353) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 코드 일치 요약 대상 형식 오류 라벨 헬퍼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 354) 다음 순차 작업
1. [완료] 오프라인 비교 코드 일치 요약 일치 라벨 헬퍼(`buildOfflineDetailCompareCodeMatchSummaryMatchedLabelKo`)를 추가해 일치 상태 문구를 단일 함수로 표준화.
2. [완료] 오프라인 비교 코드 일치 요약 라벨 경로의 일치 상태 분기가 인라인 문자열 대신 일치 라벨 헬퍼를 사용하도록 반영.
3. [완료] 모바일 회귀 체크에 일치 라벨 헬퍼 시나리오를 추가해 일치 요약 라벨 경로에서 문구 일치성을 검증.

## 355) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 코드 일치 요약 일치 라벨 헬퍼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 356) 다음 순차 작업
1. [완료] 오프라인 비교 코드 일치 요약 불일치 라벨 헬퍼(`buildOfflineDetailCompareCodeMatchSummaryMismatchedLabelKo`)를 추가해 불일치 상태 문구를 단일 함수로 표준화.
2. [완료] 오프라인 비교 코드 일치 요약 라벨 경로의 불일치 상태 분기가 인라인 문자열 대신 불일치 라벨 헬퍼를 사용하도록 반영.
3. [완료] 모바일 회귀 체크에 불일치 라벨 헬퍼 시나리오를 추가해 일치 요약 라벨 경로에서 문구 일치성을 검증.

## 357) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 코드 일치 요약 불일치 라벨 헬퍼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`

## 358) 다음 순차 작업
1. [완료] 오프라인 비교 코드 일치 요약 prefix 라벨 헬퍼(`buildOfflineDetailCompareCodeMatchSummaryPrefixLabelKo`)를 추가해 일치 요약 prefix 문구를 단일 함수로 표준화.
2. [완료] 오프라인 비교 코드 일치 요약 라벨/세부 라벨 경로가 인라인 prefix 문자열 대신 prefix 라벨 헬퍼를 사용하도록 반영.
3. [완료] 모바일 회귀 체크에 prefix 라벨 헬퍼 시나리오를 추가해 일치 요약 라벨 경로에서 prefix 문구 일치성을 검증.

## 359) 추가 문서
- 모바일 MVP 수직슬라이스 가이드(오프라인 비교 코드 일치 요약 prefix 라벨 헬퍼 반영): `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`
