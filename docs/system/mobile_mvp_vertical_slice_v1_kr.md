# 모바일 MVP 수직슬라이스 가이드 v1

기준 시점: 2026-02-24  
대상 파일:
- `/Users/hirediversity/Idle/mobile/mvp_v1/index.html`
- `/Users/hirediversity/Idle/mobile/mvp_v1/app.mjs`
- `/Users/hirediversity/Idle/mobile/mvp_v1/engine.mjs`
- `/Users/hirediversity/Idle/scripts/check_mobile_mvp_slice_regression_v1.mjs`

## 1) 목적
- 모바일 화면 기준으로 전투 1루프 + 돌파/환생 1루프 + 저장/복구 UI를 한 화면에서 검증한다.
- 기존 밸런스 데이터(`realm_progression_v1`, `realm_locale_ko_v1`)를 직접 읽어 수직슬라이스를 빠르게 반복한다.

## 2) 실행 방법
```bash
cd /Users/hirediversity/Idle
npm run mobile:mvp:serve
```
- 브라우저 접속:
  - `http://localhost:4173/mobile/mvp_v1/index.html`
- 모바일 점검:
  - 브라우저 DevTools Device Toolbar(예: iPhone 12/Pixel 7)에서 UI/터치 플로우 확인

## 3) 핵심 기능
- 전투 1회:
  - 현재 경지 기반 승패 판정
  - 기/영석/환생정수 증감
- 돌파 시도:
  - 필요 기 충족 시 확률 판정
  - 성공/경상 실패/경지 후퇴/사망 실패(환생) 처리
  - 영약/수호부 사용 반영
- 자동 10초 진행:
  - 기 자동 축적 + 자동 전투 + 자동 돌파 루프
  - 도겁 자동 허용 옵션 연동
- 저장/복구:
  - 로컬 저장(localStorage)
  - JSON 내보내기/가져오기

## 4) 저장 포맷
- localStorage key:
  - `idle_xianxia_mobile_mvp_v1_save`
- 포함 항목:
  - 경지/환생 횟수
  - 통화(기/영석/환생정수)
  - 영약/부적 수량
  - 자동 옵션 상태
  - 이벤트 로그

## 5) 회귀 체크
```bash
cd /Users/hirediversity/Idle
npm run mobile:mvp:check
```
- 점검 시나리오:
  - 전투 1회 상태 변화
  - 기 부족 돌파 차단
  - 사망 실패 → 환생 루프 발동
  - 자동 10초 루프 실행
  - 저장 직렬화/복원 roundtrip
