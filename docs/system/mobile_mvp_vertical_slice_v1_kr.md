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
  - `safe-area`(노치/홈 인디케이터) 영역에서 하단 버튼/모달이 가려지지 않는지 확인

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
  - `전투 속도` 옵션(저속/표준/고속)에 따라 루프 cadence 변경
- 실시간 자동 진행:
  - `실시간 자동 시작/중지` 버튼으로 1초 단위 루프 실행
  - 전투 속도 옵션 기준 cadence를 타임라인 누적 방식으로 적용
  - 10초마다 누적 요약 로그를 기록하고 3틱마다 localStorage 동기화
  - 백그라운드 진입 시 실시간 자동 중지 + 포그라운드 복귀 시 오프라인 정산 자동 시도
  - `autoResumeRealtime`가 켜져 있으면 포그라운드 복귀/앱 진입/세이브 불러오기 후 실시간 자동 재개
  - 실시간 통계 카드(`누적 시간/전투/돌파/환생`)를 화면에 상시 표시
  - `실시간 리포트 JSON` 버튼으로 누적 세션 리포트를 `savePayload`로 내보내기
  - `실시간 통계 초기화` 버튼으로 누적 세션 통계를 즉시 리셋
- 저장/복구:
  - 로컬 저장(localStorage, 슬롯 1~3)
  - JSON 내보내기/가져오기
  - 활성 슬롯 -> 대상 슬롯 복제(`optCopySlotTarget`, `btnCopySlot`)
    - 대상 슬롯에 데이터가 있으면 overwrite 확인 모달 후 진행
  - 활성 슬롯 삭제(메모리 상태 유지)
    - 활성 슬롯이 비어 있으면 삭제를 skip하고 상태 메시지만 표시
  - 슬롯 복제/삭제 확인 규칙은 엔진 정책 함수로 공통 관리
  - 슬롯 요약 목록(슬롯별 플레이어/경지/저장시각/상태) 표시
  - 슬롯 요약 항목 탭/Enter로 해당 슬롯 즉시 활성화 + 저장 데이터가 있으면 즉시 불러오기
    - 다른 슬롯에서 퀵 로드 시 확인 모달 후 진행
    - 퀵 로드 연속 입력은 0.7초 디바운스로 중복 실행 방지
  - 오프라인 복귀 정산(최대 12시간 cap)
    - 앱 진입 시 기존 세이브 자동 로드 후 1회 적용
    - 로컬 불러오기/JSON 가져오기 직후에도 동일 로직 적용
    - 정산 발생 시 팝업 카드로 시간/전투/돌파/환생/재화 순변화 노출
    - 팝업에서 세부 로그 토글(최근 이벤트) + 정산 리포트 JSON 내보내기 지원
- 옵션:
  - `앱 복귀 시 실시간 자동 재개` (`autoResumeRealtime`, on/off)
  - `전투 속도` (`1=저속, 2=표준, 3=고속`)
    - 저속: `battleEverySec=3`, `breakthroughEverySec=4`, `passiveQiRatio=0.01`
    - 표준: `battleEverySec=2`, `breakthroughEverySec=3`, `passiveQiRatio=0.012`
    - 고속: `battleEverySec=1`, `breakthroughEverySec=2`, `passiveQiRatio=0.014`
  - `오프라인 정산 시간(시간)` (`1~168`)
  - `오프라인 세부 로그 개수` (`5~120`)
  - 위 4개는 저장 데이터(`settings`)에 영속화되어 다음 접속에도 유지
  - `세이브 슬롯` 선택(`optSaveSlot`, 1~3): 저장/불러오기 대상 슬롯 지정

## 4) 저장 포맷
- localStorage key:
  - 슬롯 save: `idle_xianxia_mobile_mvp_v1_save_slot_{1|2|3}`
  - 슬롯 선호값: `idle_xianxia_mobile_mvp_v1_slot_pref`
  - 레거시 fallback: `idle_xianxia_mobile_mvp_v1_save` (slot1 비어있을 때만 자동 참조)
- 포함 항목:
  - 경지/환생 횟수
  - 통화(기/영석/환생정수)
  - 영약/부적 수량
  - 자동 옵션 상태
  - 이벤트 로그
  - 마지막 활동 시각(`lastActiveEpochMs`)
  - 실시간 세션 통계(`realtimeStats`: sessionStartedAtIso/timelineSec/elapsedSec/전투·돌파·환생/anchor 재화)

## 5) 오프라인 복귀 정산 규칙
- 계산:
  - `rawOfflineSec = floor((nowEpochMs - anchorEpochMs) / 1000)`
  - `appliedOfflineSec = min(rawOfflineSec, offlineCapHours * 3600)`
- anchor 우선순위:
  - `lastActiveEpochMs`
  - `lastSavedAtIso`(파싱 가능 시)
- 적용 방식:
  - `battleSpeed` 기반 cadence를 적용한 `runAutoSliceSeconds(..., { seconds: appliedOfflineSec, suppressLogs: true })`로 압축 정산
  - 정산 후 단일 `offline` 로그를 남기고 `lastActiveEpochMs`를 현재 시각으로 동기화
- UI:
  - `offlineModal` 카드에서 정산 결과를 즉시 확인 후 닫기 가능
  - `btnToggleOfflineDetail`로 상세 이벤트 목록 확장/축소
  - `btnExportOfflineReport`로 정산 리포트를 JSON 형태로 `savePayload`에 주입(클립보드 복사 시도)
  - 상세 로그 수집 개수는 `offlineEventLimit` 설정값을 따른다

## 6) 모바일 뷰포트 최적화
- `viewport-fit=cover` + CSS `env(safe-area-inset-*)` 패딩 적용.
- 버튼/입력 최소 높이 44px로 터치 타겟 확보.
- 작은 화면(`<=680px`)에서 액션 패널(`.actions`) sticky 고정.
- 로그 목록 스크롤 영역(`max-height`)로 긴 로그에서도 조작 영역 유지.
- 상태 텍스트(`aria-live="polite"`)로 복귀 정산/오류 메시지 접근성 강화.

## 7) 회귀 체크
```bash
cd /Users/hirediversity/Idle
npm run mobile:mvp:dom:check
npm run mobile:mvp:check
```
- 점검 시나리오:
  - 전투 1회 상태 변화
  - 기 부족 돌파 차단
  - 사망 실패 → 환생 루프 발동
  - 슬롯 요약 퀵 액션 분기(`ok/empty/corrupt`) 결정 로직 검증
  - 슬롯 요약 퀵 로드 디바운스(0.7초) 중복 입력 차단 검증
  - 슬롯 복제/삭제 정책(`same_slot/target_empty/target_has_data/corrupt_slot`) 검증
  - 전투 속도 설정에 따른 자동 루프 cadence 차이 검증
  - 타임라인 오프셋 기반 1초 chunk 연속 실행 시 cadence 유지 검증(실시간 루프 기반)
  - 자동 10초 루프 실행
  - 오프라인 복귀 20시간 입력 시 설정 cap(`offlineCapHours`) 정산 검증
  - 오프라인 경과시간 0초일 때 정산 skip(`time_not_elapsed`) 검증
  - 저장 직렬화/복원 roundtrip
  - 모바일 화면 필수 DOM id/모달 요소/safe-area 스타일 계약 검증
