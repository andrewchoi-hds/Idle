# 상점/재화 소모 테이블 v1

## 1) 파일
- 상점 카탈로그: `/Users/hirediversity/Idle/data/economy/shop_catalog_v1.csv`
- 재화 소모: `/Users/hirediversity/Idle/data/economy/currency_sinks_v1.csv`
- JSON export:
  - `/Users/hirediversity/Idle/data/export/shop_catalog_v1.json`
  - `/Users/hirediversity/Idle/data/export/currency_sinks_v1.json`

## 2) 구성
- 상점 엔트리 27개
- 재화 소모 엔트리 18개

## 3) 경제 설계 원칙
1. `spirit_coin`은 일상 소비(강화/연성/상점) 중심.
2. `rebirth_essence`는 메타 성장(환생트리/도겁보험) 중심.
3. 후반부로 갈수록 고정비보다 기하 증가비(`base*(1.2^level)`) 비중 확대.
4. `critical` 우선순위 소모처는 성장 체감에 직접 영향.

## 4) 운영 지표
- 주간 재화 유입 대비 예상 소모 비율 목표:
  - spirit_coin: 0.78 ~ 0.92
  - rebirth_essence: 0.68 ~ 0.85
- 상점 판매 지표가 낮으면 `price`와 `stock_value` 동시 조정.
