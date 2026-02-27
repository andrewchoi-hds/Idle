# 새 쓰레드 인수인계 (Mobile MVP v1, 2026-02-27 업데이트)

## 1) 현재 스냅샷
- 저장소: `/Users/hirediversity/Idle`
- 기준 브랜치: `main`
- 상태: `origin/main`과 동기화, 워킹트리 클린
- 최신 기준 커밋: `c53df3d` (`docs(system): refresh mobile mvp handoff status`, PR #175)

## 2) 최근 완료 범위
- 오프라인 비교 뷰의 fallback/descriptor 정규화 작업을 연속 반영.
- 최근 머지 PR:
  - #164 action hint fallback descriptor helpers
  - #165 result state fallback descriptor helpers
  - #166 compare fallback reason centralization
  - #167 delta summary fallback descriptor helpers
  - #168 result label fallback descriptor helper
  - #169 compare source descriptor helpers
  - #170 target input state descriptor helpers
  - #171 compare failure descriptor helpers
  - #172 payload load source descriptor helpers
  - #173 compare input and check source descriptor helpers
  - #174 payload extract source descriptor helpers
  - #175 refresh mobile mvp handoff status
- 설계 로그 반영 위치: `/Users/hirediversity/Idle/docs/idle_xianxia_design_v0.3_kr.md`의 `444)~463)` 구간.

## 3) 남은 작업 큐 (새 쓰레드 시작용)
1. 비교 코드 요약 상태 descriptor 헬퍼화.
   - 대상:
     - `buildOfflineDetailCompareCodeTargetSummaryTone`
     - `buildOfflineDetailCompareCodeCurrentSummaryTone`
   - 제안 함수:
     - `buildOfflineDetailCompareCodeSummaryStateDescriptors`
     - `buildOfflineDetailCompareCodeSummaryStateDescriptor`
   - 목표: `empty/invalid/valid` 상태 분기를 descriptor 기반으로 통일.
2. payload 추출 fallback descriptor 헬퍼화.
   - 대상: `extractOfflineDetailCompareCodeFromPayloadTextWithSource`
   - 제안 함수:
     - `buildOfflineDetailComparePayloadExtractFallbackDescriptors`
     - `buildOfflineDetailComparePayloadExtractFallbackDescriptor`
   - 목표: JSON 추출 실패 후 `text/none` fallback 분기(source/code 매핑)를 descriptor 기반으로 통일.
3. 회귀 체크 추가.
   - 대상 파일: `/Users/hirediversity/Idle/scripts/check_mobile_mvp_slice_regression_v1.mjs`
   - 제안 시나리오 id:
     - `offline_detail_compare_code_summary_state_descriptors_are_stable`
     - `offline_detail_compare_payload_extract_fallback_descriptors_are_stable`
4. 문서 동기화.
   - `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`에 신규 헬퍼/검증 항목 반영.
   - `/Users/hirediversity/Idle/docs/idle_xianxia_design_v0.3_kr.md`에 `464)`, `465)` 섹션 추가.

## 4) 완료 기준 (Definition of Done)
- 엔진 코드에서 해당 분기가 descriptor 헬퍼를 통해서만 결정됨.
- 회귀 체크 신규 시나리오 2개 추가 및 통과.
- 아래 명령 전부 통과:
  - `npm run typecheck`
  - `npm run combat:diff:py-ts:suite`
  - `npm run save:auto:regression:check`
  - `npm run save:offline:regression:check`
  - `npm run pr:validation:sync:check`
  - `npm run pr:body:lint:regression:check`
  - `npm run pr:body:gen:regression:check`
  - `npm run pr:validation:sync:regression:check`
  - `npm run pr:required-check:coverage:check`
  - `npm run pr:validation:registry:check`
  - `npm run mobile:mvp:check`
- 문서 2곳 동기화 완료.

## 5) 새 쓰레드 시작 프롬프트 (복붙용)
```text
/Users/hirediversity/Idle 기준으로 다음 슬라이스를 진행해줘.

목표:
1) buildOfflineDetailCompareCodeTargetSummaryTone / buildOfflineDetailCompareCodeCurrentSummaryTone 를 descriptor 헬퍼 기반으로 리팩터링
2) extractOfflineDetailCompareCodeFromPayloadTextWithSource 의 text/none fallback 경로를 descriptor 헬퍼 기반으로 리팩터링
3) scripts/check_mobile_mvp_slice_regression_v1.mjs 에 descriptor 안정성 시나리오 2개 추가
   - offline_detail_compare_code_summary_state_descriptors_are_stable
   - offline_detail_compare_payload_extract_fallback_descriptors_are_stable
4) docs/system/mobile_mvp_vertical_slice_v1_kr.md 와 docs/idle_xianxia_design_v0.3_kr.md(464/465) 동기화

작업 방식:
- 새 브랜치 생성: codex/offline-compare-summary-state-descriptor-v1
- 구현 후 아래 검증을 모두 실행:
  - npm run typecheck
  - npm run combat:diff:py-ts:suite
  - npm run save:auto:regression:check
  - npm run save:offline:regression:check
  - npm run pr:validation:sync:check
  - npm run pr:body:lint:regression:check
  - npm run pr:body:gen:regression:check
  - npm run pr:validation:sync:regression:check
  - npm run pr:required-check:coverage:check
  - npm run pr:validation:registry:check
  - npm run mobile:mvp:check
- PR 본문은 Summary/Changes/Validation/Docs/Notes를 구체적으로 작성
```
