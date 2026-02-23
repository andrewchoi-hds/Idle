# Save v2 정식 검증기

## 1) 파일
- v2 타입: `/Users/hirediversity/Idle/src/save/saveSchemaV2.ts`
- v2 검증기: `/Users/hirediversity/Idle/src/save/validateSaveV2.ts`
- 마이그레이션 연동: `/Users/hirediversity/Idle/src/save/migrateSave.ts`
- 파이썬 공통 검증 모듈: `/Users/hirediversity/Idle/scripts/save_validation_v2.py`
- v2 샘플 점검: `/Users/hirediversity/Idle/scripts/check_save_sample_v2.py`
- v2 실패 케이스 점검: `/Users/hirediversity/Idle/scripts/check_save_v2_failure_cases.py`

## 2) 검증 범위
- v1 공통 구조: `validateSaveV1` 재사용(버전 필드만 v2 호환 처리)
- v2 전용 필드:
  - `pity_counters`
  - `economy_tracking`
  - `migration`
- 핵심 제약:
  - 카운터/주간 누적값은 음수 불가
  - `migration.migrated_from_version >= 1`
  - `migration.migrated_at`는 ISO datetime

## 3) API
- `validateSaveV2(payload)`
  - 성공: `{ ok: true, value }`
  - 실패: `{ ok: false, errors[] }`
- `assertValidSaveV2(payload)`
  - 실패 시 path 기반 상세 메시지로 예외 발생

## 4) 마이그레이션 동작
- `migrateUnknownSaveToV2(input)`:
  1. 입력이 이미 `version=2`면 `validateSaveV2`로 정식 검증.
  2. 아니면 `validateSaveV1` 통과 시 `migrateSaveV1ToV2` 수행.
  3. 마이그레이션 결과를 다시 `validateSaveV2`로 검증 후 반환.

## 5) 테스트
```bash
/Users/hirediversity/Idle/scripts/check_save_sample_v2.py
/Users/hirediversity/Idle/scripts/check_save_v2_failure_cases.py
cd /Users/hirediversity/Idle && npm run typecheck
```
