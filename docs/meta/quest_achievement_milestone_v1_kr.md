# 퀘스트/업적/마일스톤 보상 테이블 v1

## 1) 파일
- 퀘스트: `/Users/hirediversity/Idle/data/meta/quests_v1.csv`
- 업적: `/Users/hirediversity/Idle/data/meta/achievements_v1.csv`
- 마일스톤: `/Users/hirediversity/Idle/data/meta/milestones_v1.csv`
- JSON export:
  - `/Users/hirediversity/Idle/data/export/quests_v1.json`
  - `/Users/hirediversity/Idle/data/export/achievements_v1.json`
  - `/Users/hirediversity/Idle/data/export/milestones_v1.json`

## 2) 구성
- 퀘스트 25개
  - main 12 / daily 6 / weekly 4 / side 3
- 업적 25개
- 마일스톤 20개

## 3) 설계 원칙
1. 메인 퀘스트는 경지 구간 진척을 강제 가이드.
2. 일일/주간은 재화 순환(영석/윤회정수) 안정화.
3. 업적은 첫 클리어 + 누적 목표를 혼합해 장기 동기 제공.
4. 마일스톤은 큰 난이도 구간 도달 시 보정 보상 제공.

## 4) 연동 포인트
- `reward_item_ref`는 `/Users/hirediversity/Idle/data/balance/potions_talismans_v1.csv`의 `item_id` 또는 `none`.
- `objective_value`는 전투/진행 로그 키와 파싱 가능한 형식(`id:count`) 유지.
