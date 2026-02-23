# 경제 튜닝 적용 스크립트 v1

## 1) 파일
- 적용 스크립트: `/Users/hirediversity/Idle/scripts/apply_economy_tuning_v1.py`
- 입력 리포트: `/Users/hirediversity/Idle/data/sim/economy_tuning_report_v1.csv`
- 출력(튜닝본):
  - `/Users/hirediversity/Idle/data/economy/shop_catalog_tuned_v1.csv`
  - `/Users/hirediversity/Idle/data/economy/currency_sinks_tuned_v1.csv`
- 출력(변경내역): `/Users/hirediversity/Idle/data/sim/economy_tuning_changes_v1.csv`

## 2) 모드
- `clamped`(기본): `recommend_shop_price_mult`, `recommend_sink_cost_mult` 사용.
- `global`: `recommend_global_outflow_mult` 사용.

## 3) 실행
```bash
/Users/hirediversity/Idle/scripts/apply_economy_tuning_v1.py --mode clamped
/Users/hirediversity/Idle/scripts/apply_economy_tuning_v1.py --mode global
```

## 4) 운영 팁
1. 먼저 `clamped` 결과를 적용해 미세 조정.
2. 소모율이 크게 벗어나면 `global`로 대규모 보정.
3. 적용 후 `tune_economy_v1.py` 재실행으로 재평가.

## 5) 추천 후속 절차
1. 무결성 점검:
```bash
/Users/hirediversity/Idle/scripts/check_economy_tuned_consistency_v1.py
```
2. tuned profile로 export:
```bash
/Users/hirediversity/Idle/scripts/generate_balance_tables.py --economy-profile tuned
```
3. 관련 문서:
- `/Users/hirediversity/Idle/docs/economy/economy_tuned_consistency_check_v1_kr.md`
- `/Users/hirediversity/Idle/docs/economy/economy_export_profile_v1_kr.md`
