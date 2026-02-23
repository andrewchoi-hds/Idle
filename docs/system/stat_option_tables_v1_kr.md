# 스탯 계수/옵션 해금 데이터 v1

## 1) 파일
- 스탯 계수표: `/Users/hirediversity/Idle/data/system/stat_growth_coeffs_v1.csv`
- 옵션 해금표: `/Users/hirediversity/Idle/data/system/options_unlocks_v1.csv`
- JSON export:
  - `/Users/hirediversity/Idle/data/export/stat_growth_coeffs_v1.json`
  - `/Users/hirediversity/Idle/data/export/options_unlocks_v1.json`

## 2) 스탯 계수 사용 규칙
- 기본식:
```text
최종스탯 = base_value
  + 레벨 * per_player_level
  + 대경지진행 * per_major_stage
  + 세부경지진행 * per_sub_stage

최종스탯 = 최종스탯 * (1 + 장비합계 * equipment_scale_pct)
최종스탯 = 최종스탯 * (1 + 환생합계 * rebirth_scale_pct)
최종스탯 = 최종스탯 * (1 + 버프합계 * buff_scale_pct)
```
- `hard_cap`가 -1이 아니면 상한 적용.
- `soft_cap_start`가 -1이 아니면 초과분에 `soft_cap_slope`를 적용해 감쇠.

## 3) 옵션 해금 사용 규칙
- `unlock_condition_type`:
  - `tutorial`: 튜토리얼 플래그
  - `difficulty`: 최고 난이도 인덱스
- `requires_resource=yes`면 `cost_value`를 소모.
- `safe_guard=critical` 옵션은 기본 ON 유지 권장.

## 4) 초기 정책
1. `opt_auto_tribulation`은 유저가 명시 ON 하기 전 강제 OFF.
2. `opt_warning_lock`과 `opt_rebirth_confirm`은 삭제 불가 안전장치로 처리.
3. 가속 옵션(`2x/3x`)은 보스/도겁에서 자동 1단계 하향 가능.
