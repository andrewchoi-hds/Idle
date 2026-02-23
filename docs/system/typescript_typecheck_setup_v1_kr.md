# TypeScript 타입체크 셋업 v1

## 1) 추가 파일
- 패키지 설정: `/Users/hirediversity/Idle/package.json`
- TS 설정: `/Users/hirediversity/Idle/tsconfig.json`

## 2) 설치 패키지
- `typescript`
- `@types/node`
- `tsx`

## 3) 실행
```bash
cd /Users/hirediversity/Idle
npm run typecheck
```

## 4) 현재 범위
- `src/**/*.ts`, `scripts/**/*.ts`를 `noEmit`으로 타입체크.
- 런타임 출력물은 생성하지 않음.

## 5) 참고
- 기존 검증기(`validateSave.ts`, `validateSaveV2.ts`)는 TS 5.9 단언 규칙에 맞게 타입 단언(`as unknown as ...`)을 적용했다.
