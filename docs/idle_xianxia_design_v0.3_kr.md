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
