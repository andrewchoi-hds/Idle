# 경제 프로파일 export v1

## 1) 목적
- 동일한 런타임 JSON 스키마를 유지하면서, 경제 데이터 소스를 `base`/`tuned`로 선택해 export 한다.

## 2) 실행
```bash
# 기본 경제 데이터 사용
/Users/hirediversity/Idle/scripts/generate_balance_tables.py --economy-profile base

# 튜닝된 경제 데이터 사용
/Users/hirediversity/Idle/scripts/generate_balance_tables.py --economy-profile tuned
```

## 3) 소스 선택 규칙
- `base`
  - `/Users/hirediversity/Idle/data/economy/shop_catalog_v1.csv`
  - `/Users/hirediversity/Idle/data/economy/currency_sinks_v1.csv`
- `tuned`
  - `/Users/hirediversity/Idle/data/economy/shop_catalog_tuned_v1.csv`
  - `/Users/hirediversity/Idle/data/economy/currency_sinks_tuned_v1.csv`
- `tuned` 선택 시 파일이 없으면 스크립트가 즉시 실패한다.

## 4) 출력
- 기존 런타임 JSON 경로는 동일:
  - `/Users/hirediversity/Idle/data/export/shop_catalog_v1.json`
  - `/Users/hirediversity/Idle/data/export/currency_sinks_v1.json`
- 추가 메타:
  - `/Users/hirediversity/Idle/data/export/balance_manifest_v1.json`
  - 포함 항목: 생성 시각, 선택한 economy profile, 실제 CSV 소스 경로.

## 5) 런타임 연동
- 로더(`/Users/hirediversity/Idle/src/balance/balanceLoader.ts`)는 manifest를 optional로 로드한다.
- 구버전 export 디렉터리(Manifest 없음)도 하위호환으로 동작한다.
- 런타임 가드 API:
  - `assertEconomyProfile(tables, "base" | "tuned", options?)`
  - `getEconomyProfileSummary(tables)`
- 상세 문서: `/Users/hirediversity/Idle/docs/system/runtime_economy_profile_guard_v1_kr.md`
