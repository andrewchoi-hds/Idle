# 맵/이벤트/드롭풀 데이터 v1

## 1) 파일
- 맵 노드: `/Users/hirediversity/Idle/data/map/map_nodes_v1.csv`
- 이벤트: `/Users/hirediversity/Idle/data/map/map_events_v1.csv`
- 드롭풀: `/Users/hirediversity/Idle/data/map/drop_pools_v1.csv`
- JSON export:
  - `/Users/hirediversity/Idle/data/export/map_nodes_v1.json`
  - `/Users/hirediversity/Idle/data/export/map_events_v1.json`
  - `/Users/hirediversity/Idle/data/export/drop_pools_v1.json`

## 2) 구성 수량
- 맵 노드 42개 (인간계 18, 신선계 12, 진선계 12)
- 이벤트 32개
- 드롭풀 엔트리 155개

## 3) 연동 규칙
1. `map_nodes_v1.csv.event_table` -> `map_events_v1.csv.event_table` 키로 이벤트 후보를 조회.
2. `map_nodes_v1.csv.drop_group` -> `drop_pools_v1.csv.drop_group` 키로 드롭 후보를 조회.
3. `node_type=tribulation` 노드는 `special_rule=tribulation_only`를 강제.
4. `boss_id`가 `none`이 아니면 `/Users/hirediversity/Idle/data/combat/monsters_v1.csv`의 `monster_id`와 연결.

## 4) 런타임 처리 권장
- 이벤트 샘플링: `trigger_weight` 가중치 랜덤.
- 드롭 샘플링: 드롭 그룹 내 `weight` 기반 N회 추출.
- 난이도 게이트: `unlock_condition` 파싱 후 미충족 시 후보군 제외.
