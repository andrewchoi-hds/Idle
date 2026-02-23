# 장비 드롭 연동 매핑 v1

## 1) 파일
- 베이스 풀: `/Users/hirediversity/Idle/data/equipment/equipment_base_pools_v1.csv`
- 어픽스 풀: `/Users/hirediversity/Idle/data/equipment/equipment_affix_pools_v1.csv`
- 노드 드롭 링크: `/Users/hirediversity/Idle/data/equipment/equipment_drop_links_v1.csv`
- JSON export:
  - `/Users/hirediversity/Idle/data/export/equipment_base_pools_v1.json`
  - `/Users/hirediversity/Idle/data/export/equipment_affix_pools_v1.json`
  - `/Users/hirediversity/Idle/data/export/equipment_drop_links_v1.json`

## 2) 구성
- 베이스 풀 28개
- 어픽스 풀 15개
- 노드 링크 42개(맵 노드 1:1)

## 3) 연동 규칙
1. `node_id`로 드롭 링크 조회.
2. 링크의 `weapon_pool/armor_pool/accessory_pool/relic_pool`에서 베이스 후보를 뽑음.
3. `affix_profile_id`로 prefix/suffix 후보 및 개수 범위를 결정.
4. `guaranteed_rarity_floor` 이하 결과는 reroll하여 하한 보장.
