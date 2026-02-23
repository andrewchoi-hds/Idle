# 세이브 스키마/검증기 v1

## 1) 파일
- JSON Schema: `/Users/hirediversity/Idle/data/schema/save_v1.schema.json`
- 샘플 세이브: `/Users/hirediversity/Idle/data/schema/save_v1.sample.json`
- TS 타입: `/Users/hirediversity/Idle/src/save/saveSchema.ts`
- TS 검증기: `/Users/hirediversity/Idle/src/save/validateSave.ts`
- 샘플 검증 스크립트: `/Users/hirediversity/Idle/scripts/check_save_sample_v1.py`

## 2) 스키마 핵심 구조
- 최상위: `version`, `player`, `progression`, `currencies`, `inventory`, `equipment`, `settings`, `meta`, `timestamps`
- `version`은 고정값 `1`
- 장비 슬롯은 `weapon/armor/accessory/relic` 고정
- `battle_speed`는 `1|2|3`

## 3) 검증기 사용
- `validateSaveV1(payload)`:
  - 성공 시 `{ ok: true, value }`
  - 실패 시 `{ ok: false, errors[] }`
- `assertValidSaveV1(payload)`:
  - 실패 시 상세 경로 포함 예외 throw

## 4) 적용 권장
1. 클라이언트 로컬 로드 직후 1차 검증.
2. 서버 업로드 전 2차 검증.
3. 버전 변경 시 `save_v2` 스키마 분리 및 마이그레이션 함수 추가.

## 5) 빠른 점검
```bash
/Users/hirediversity/Idle/scripts/check_save_sample_v1.py
```

## 6) 버전 확장
- v2 스키마/마이그레이션: `/Users/hirediversity/Idle/docs/system/save_migration_v1_to_v2_kr.md`
- v2 정식 검증기: `/Users/hirediversity/Idle/docs/system/save_validator_v2_kr.md`
- v2 실패 케이스 점검: `/Users/hirediversity/Idle/docs/system/save_failure_cases_v2_kr.md`
