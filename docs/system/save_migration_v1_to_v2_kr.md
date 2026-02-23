# Save V1 -> V2 마이그레이션 골격

## 1) 파일
- v2 스키마: `/Users/hirediversity/Idle/data/schema/save_v2.schema.json`
- v2 샘플: `/Users/hirediversity/Idle/data/schema/save_v2.sample.json`
- v2 타입: `/Users/hirediversity/Idle/src/save/saveSchemaV2.ts`
- v2 검증기: `/Users/hirediversity/Idle/src/save/validateSaveV2.ts`
- 마이그레이션: `/Users/hirediversity/Idle/src/save/migrateSave.ts`
- 샘플 점검:
  - `/Users/hirediversity/Idle/scripts/check_save_sample_v1.py`
  - `/Users/hirediversity/Idle/scripts/check_save_sample_v2.py`
  - `/Users/hirediversity/Idle/scripts/check_save_v2_failure_cases.py`

## 2) 마이그레이션 추가 필드
- `pity_counters`
- `economy_tracking`
- `migration`

## 3) 진입 함수
- `migrateSaveV1ToV2(saveV1)`
- `migrateUnknownSaveToV2(input)`

## 4) 상태
1. v2 정식 validator(`validateSaveV2`) 연동 완료.
2. `migrateUnknownSaveToV2`는 `version=2` 입력도 정식 검증 후 통과 처리.
3. v1 -> v2 변환 결과도 반환 전 재검증한다.

## 5) 후속 작업
1. 서버 저장 시 버전별 마이그레이션 체인 관리.
2. 마이그레이션 이벤트 로그 수집.
3. 마이그레이션 실패 리포트 자동 수집.
