# 장비/어픽스/롤링 데이터 v1

## 1) 파일
- 장비 베이스: `/Users/hirediversity/Idle/data/equipment/equipment_bases_v1.csv`
- 어픽스: `/Users/hirediversity/Idle/data/equipment/equipment_affixes_v1.csv`
- 롤링 규칙: `/Users/hirediversity/Idle/data/equipment/equipment_roll_rules_v1.csv`
- 드롭 연동:
  - `/Users/hirediversity/Idle/data/equipment/equipment_base_pools_v1.csv`
  - `/Users/hirediversity/Idle/data/equipment/equipment_affix_pools_v1.csv`
  - `/Users/hirediversity/Idle/data/equipment/equipment_drop_links_v1.csv`
- JSON export:
  - `/Users/hirediversity/Idle/data/export/equipment_bases_v1.json`
  - `/Users/hirediversity/Idle/data/export/equipment_affixes_v1.json`
  - `/Users/hirediversity/Idle/data/export/equipment_roll_rules_v1.json`

## 2) 구성
- 장비 베이스 28개 (world/slot/rarity 분산)
- 어픽스 36개 (prefix/suffix)
- 롤링 규칙 12개

## 3) 롤링 규칙 요약
1. 희귀도별 `max_prefix`, `max_suffix` 고정.
2. 동일 `exclusive_group` 중복 금지(`allow_duplicate_exclusive=no`).
3. `pity_after_n` 규칙으로 저롤 누적 보정.
4. 옵션 잠금/전승/정화는 `rebirth_essence` 소모를 기본으로 설정.

## 4) 런타임 연동
- 로더: `/Users/hirediversity/Idle/src/balance/balanceLoader.ts`
- 인덱스:
  - `equipmentBaseById`
  - `equipmentAffixById`
  - `equipmentAffixesBySlot`
  - `equipmentRollRuleById`
