# 런타임 economy profile 가드 v1

## 1) 파일
- 로더/가드 API: `/Users/hirediversity/Idle/src/balance/balanceLoader.ts`
- export manifest: `/Users/hirediversity/Idle/data/export/balance_manifest_v1.json`

## 2) 제공 API
- `getEconomyProfileState(tables)`
- `getEconomyProfileInfo(tables)`
- `getEconomyProfileSummary(tables)`
- `assertEconomyProfile(tables, expected, options?)`

## 3) 사용 예시
```ts
import {
  loadBalanceTables,
  assertEconomyProfile,
  getEconomyProfileSummary,
} from "/Users/hirediversity/Idle/src/balance/balanceLoader";

const tables = await loadBalanceTables();
assertEconomyProfile(tables, "tuned", { context: "prod-runtime" });
console.log(getEconomyProfileSummary(tables));
```

## 4) 동작 규칙
- manifest가 있으면 `base|tuned` 값을 읽어 strict 비교.
- manifest가 없으면 profile은 `unknown`으로 간주.
- `assertEconomyProfile`는 mismatch 시 예외를 던진다.
- 구버전 export와 하위호환이 필요하면 `allowUnknown: true`로 완화 가능.

## 5) 운영 권장
1. 개발/스테이징: `allowUnknown: true`
2. 프로덕션: `allowUnknown: false` + 기대 profile 명시
3. 배포 로그에 `getEconomyProfileSummary` 출력
