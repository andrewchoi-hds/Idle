# 전투 데이터 시트 v1 (스킬/몹)

## 1) 파일
- 스킬: `/Users/hirediversity/Idle/data/combat/skills_v1.csv`
- 몹: `/Users/hirediversity/Idle/data/combat/monsters_v1.csv`
- JSON export: `/Users/hirediversity/Idle/data/export/skills_v1.json`, `/Users/hirediversity/Idle/data/export/monsters_v1.json`

## 2) 스킬 구성
- 총 26개
- 카테고리: `active`, `passive`, `ultimate`, `tribulation`
- 월드 해금: `mortal`, `immortal`, `true`
- 핵심 컬럼:
  - `unlock_difficulty_index`: 경지 난이도 인덱스 기준 해금
  - `damage_coeff`, `shield_coeff`, `heal_coeff`: 전투 계산 직접 반영
  - `status_effect`, `status_chance_pct`, `status_duration_sec`: 상태이상 시스템 연동

## 3) 몹 구성
- 총 36개
- 타입: `normal`, `elite`, `boss`
- 핵심 컬럼:
  - `hp_mult`, `atk_mult`, `def_mult`, `speed_mult`: 기본 스탯 배율
  - `drop_group`, `rebirth_essence_drop`: 보상 테이블 연동 키
  - `ai_pattern`, `special_mechanic`: 행동 패턴/특수기 태그

## 4) 밸런스 적용 순서
1. `difficulty_index` 구간별 평균 TTK(처치 시간) 측정.
2. `elite`는 `normal` 대비 EHP 1.6~2.1배 유지.
3. `boss`는 패턴 난이도 반영해 EHP 3.2~5.0배 유지.
4. 도겁/관문 보스는 `special_mechanic` 기반 대응 스킬 강제.

## 5) 연동
- 로더: `/Users/hirediversity/Idle/src/balance/balanceLoader.ts`
- MVP 최소 루프: `/Users/hirediversity/Idle/src/combat/minimalCombatLoop.ts`
- 최소 루프 문서: `/Users/hirediversity/Idle/docs/combat/minimal_combat_loop_v1_kr.md`
- 최소 전투 덤프: `/Users/hirediversity/Idle/docs/sim/minimal_combat_sim_v1_kr.md`
- 재생성 명령:
```bash
/Users/hirediversity/Idle/scripts/generate_balance_tables.py
```
