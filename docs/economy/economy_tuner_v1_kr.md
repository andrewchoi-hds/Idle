# 경제 자동 튜너 v1

## 1) 파일
- 스크립트: `/Users/hirediversity/Idle/scripts/tune_economy_v1.py`
- 결과 리포트: `/Users/hirediversity/Idle/data/sim/economy_tuning_report_v1.csv`
- 흐름 분해: `/Users/hirediversity/Idle/data/sim/economy_flow_breakdown_v1.csv`

## 2) 입력 데이터
- 퀘스트: `/Users/hirediversity/Idle/data/meta/quests_v1.csv`
- 맵/드롭: `/Users/hirediversity/Idle/data/map/map_nodes_v1.csv`, `/Users/hirediversity/Idle/data/map/drop_pools_v1.csv`
- 상점/소모: `/Users/hirediversity/Idle/data/economy/shop_catalog_v1.csv`, `/Users/hirediversity/Idle/data/economy/currency_sinks_v1.csv`

## 3) 목표 소모율
- `spirit_coin`: 0.85
- `rebirth_essence`: 0.765

## 4) 현재 결과 (v1)
- `spirit_coin`: current 6.7869, projected 3.6764, status `severely_over_sinked`
- `rebirth_essence`: current 1.2660, projected 0.6788, status `over_sinked`

## 5) 해석
1. 현재 설정은 유입 대비 소모가 과도함(특히 spirit_coin).
2. 클램프된 권장 배율만으로는 목표치 도달이 어려운 구간이 존재.
3. `recommend_global_outflow_mult`/`recommend_global_inflow_mult`를 1차 기준으로 대규모 스케일 조정 후 세부 튜닝 권장.
4. `residual_gap_after_clamped`가 0에 가까울수록 현재 클램프 정책 내에서 목표치에 근접함.

## 6) 실행
```bash
/Users/hirediversity/Idle/scripts/tune_economy_v1.py
```

## 7) 다음 단계
- 적용 스크립트 문서: `/Users/hirediversity/Idle/docs/economy/economy_apply_tuning_v1_kr.md`
- tuned 무결성 점검: `/Users/hirediversity/Idle/docs/economy/economy_tuned_consistency_check_v1_kr.md`
- profile export: `/Users/hirediversity/Idle/docs/economy/economy_export_profile_v1_kr.md`
