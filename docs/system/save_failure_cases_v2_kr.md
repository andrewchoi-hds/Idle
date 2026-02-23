# Save v2 실패 케이스 점검 v1

## 1) 파일
- 케이스 정의: `/Users/hirediversity/Idle/data/schema/save_v2_failure_cases_v1.json`
- 공통 검증 모듈: `/Users/hirediversity/Idle/scripts/save_validation_v2.py`
- 실패 케이스 점검 스크립트: `/Users/hirediversity/Idle/scripts/check_save_v2_failure_cases.py`
- 정상 샘플 점검 스크립트: `/Users/hirediversity/Idle/scripts/check_save_sample_v2.py`

## 2) 점검 방식
1. `save_v2.sample.json`을 베이스로 로드.
2. 케이스별 `set/delete` 연산으로 변형 payload 생성.
3. `validate_save_v2_payload` 실행.
4. 실패가 발생하고, `expected_error_contains` 문자열이 실제 오류 목록에 포함되는지 확인.

## 3) 실행
```bash
/Users/hirediversity/Idle/scripts/check_save_v2_failure_cases.py
```

## 4) 포함 케이스(예시)
- 버전 불일치
- `pity_counters` 누락
- pity/economy 음수값
- `migration` 누락
- `migration.migrated_from_version` 하한 위반
- `migration.migrated_at` 비정상 날짜 포맷

## 5) 운영 루틴 권장
1. `/Users/hirediversity/Idle/scripts/check_save_sample_v2.py`
2. `/Users/hirediversity/Idle/scripts/check_save_v2_failure_cases.py`
3. 통과 시 런타임 저장/로드 파이프라인 반영
