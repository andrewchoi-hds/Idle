# 밸런스 시뮬레이터 v1

## 1) 파일
- 스크립트: `/Users/hirediversity/Idle/scripts/simulate_progression_v1.py`
- 결과(구간별): `/Users/hirediversity/Idle/data/sim/progression_timing_sim_v1.csv`
- 결과(세계 요약): `/Users/hirediversity/Idle/data/sim/progression_timing_summary_v1.csv`

## 2) 실행
```bash
/Users/hirediversity/Idle/scripts/simulate_progression_v1.py
```

## 3) 모델 개요
- 각 경지 구간의 예상 소요 시간(`expected_stage_hours`)을 계산.
- 돌파 성공률/도겁 실패 가중치/사망 패널티를 반영.
- 고정 시드(`20260223`) + 구간당 800회 시뮬레이션.

## 4) 현재 요약 (v1)
- 인간계: `84.7374h`, 예상 사망 `1.2513`
- 신선계: `116.6801h`, 예상 사망 `10.5888`
- 진선계: `115.4857h`, 예상 사망 `21.9838`

## 5) 활용
1. `expected_stage_hours` 상위 구간을 병목 후보로 지정.
2. `risk_band=extreme` 구간은 도겁 완화 수단(영약/부적/환생 보정) 우선 배치.
3. 목표 플레이타임과 차이가 크면 `base_stage_cultivation_hours` 계수를 조정.

## 6) 관련 시뮬레이션
- 최소 전투 덤프: `/Users/hirediversity/Idle/docs/sim/minimal_combat_sim_v1_kr.md`
