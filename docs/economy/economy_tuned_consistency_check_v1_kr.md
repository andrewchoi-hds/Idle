# Tuned 경제 무결성 점검 v1

## 1) 파일
- 점검 스크립트: `/Users/hirediversity/Idle/scripts/check_economy_tuned_consistency_v1.py`

## 2) 점검 항목
- base/tuned 양쪽 CSV 파일 존재 여부
- key 매칭 일치 여부
  - shop key: `shop_id + tab + item_ref + item_type + currency_type`
  - sink key: `sink_id`
- tuned 가격/코스트 양수 여부
- base 대비 tuned 배율(min/max/avg) 요약 출력

## 3) 실행
```bash
/Users/hirediversity/Idle/scripts/check_economy_tuned_consistency_v1.py
```

## 4) 운영 루틴 권장
1. `/Users/hirediversity/Idle/scripts/apply_economy_tuning_v1.py` 실행
2. `/Users/hirediversity/Idle/scripts/check_economy_tuned_consistency_v1.py` 실행
3. 통과 시 `/Users/hirediversity/Idle/scripts/generate_balance_tables.py --economy-profile tuned` 실행
