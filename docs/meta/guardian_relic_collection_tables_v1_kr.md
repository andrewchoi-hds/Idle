# 호법/법보 수집 테이블 v1

## 1) 파일
- 호법: `/Users/hirediversity/Idle/data/meta/guardians_v1.csv`
- 법보: `/Users/hirediversity/Idle/data/meta/relics_v1.csv`
- 중복 전환: `/Users/hirediversity/Idle/data/meta/collection_duplicate_conversion_v1.csv`
- 무료 수급: `/Users/hirediversity/Idle/data/meta/collection_free_sources_v1.csv`
- JSON export:
  - `/Users/hirediversity/Idle/data/export/guardians_v1.json`
  - `/Users/hirediversity/Idle/data/export/relics_v1.json`
  - `/Users/hirediversity/Idle/data/export/collection_duplicate_conversion_v1.json`
  - `/Users/hirediversity/Idle/data/export/collection_free_sources_v1.json`

## 2) 설계 의도
- 호법은 전투/돌파/운영 보조를 맡는다.
- 법보는 직접 스탯 폭증보다 규칙 변형과 준비 선택지 확장을 맡는다.
- 중복은 `collection_shard`, `collection_token`으로 전환해 꽝 체감을 줄인다.
- 무료 수급 루프를 먼저 열어, collection lane이 곧바로 과금 전용으로 읽히지 않게 한다.

## 3) rarity 구조
- `rare`
  - 인간계~신선계 초입용
  - 무료 수급과 초반 collection 확보 중심
- `epic`
  - 신선계 중반용
  - 빌드 방향성 보정
- `legendary`
  - 진선계/후반 메타용
  - 희귀하지만 코어 진행 필수로 만들지 않는다

## 4) 무료 수급 원칙
1. 메인 퀘스트와 마일스톤에서 첫 확보
2. 일일/주간에서 꾸준한 token 확보
3. 이벤트 교환으로 누적 수급
4. collection layer가 없어도 코어 progression은 목표 시간 안에 돌아가야 함

## 5) 가챠 전 가드레일
- 이 테이블만으로도 무료 진척 루프가 닫혀 있어야 한다.
- 유료 루프를 붙여도 duplicate conversion과 pity progression은 유지한다.
- `guardian_pull`, `relic_pull`은 power lane이 아니라 collection lane 기준으로 설계한다.
