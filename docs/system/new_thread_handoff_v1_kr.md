# 새 쓰레드 인수인계 (Mobile MVP v1, 2026-02-27 업데이트)

## 1) 현재 스냅샷
- 저장소: `/Users/hirediversity/Idle`
- 기준 브랜치: `main`
- 상태: `origin/main`과 동기화, 워킹트리 클린
- 최신 기준 커밋: `24e9904` (`Merge pull request #182 from andrewchoi-hds/codex/feat-mobile-compare-code-delta-part-descriptors`)

## 2) 최근 완료 범위
- 오프라인 비교 descriptor 정규화 수직 슬라이스를 `#164~#182`까지 연속 완료/머지.
- 최신 머지 PR 하이라이트:
  - #176 docs(system): fix handoff snapshot metadata
  - #177 feat(mobile): add summary state and payload fallback descriptors
  - #178 feat(mobile): add view mode alignment descriptor helpers
  - #179 feat(mobile): add compare comparable outcome descriptors
  - #180 feat(mobile): add compare aggregate count descriptors
  - #181 feat(mobile): add compare result delta part descriptors
  - #182 feat(mobile): add compare code delta part descriptors
- 설계 로그 반영 위치:
  - `/Users/hirediversity/Idle/docs/idle_xianxia_design_v0.3_kr.md`의 `444)~475)` 구간.
- 실제 화면 캡처 산출물:
  - `/Users/hirediversity/Idle/output/playwright/mobile_mvp_preview_20260227T050654Z.png`

## 3) 남은 작업 큐 (새 쓰레드 시작용)
1. 오프라인 비교 diff 메타 descriptor 헬퍼화.
   - 제안 함수:
     - `buildOfflineDetailCompareMetaMatchDescriptors`
     - `buildOfflineDetailCompareMetaMatchDescriptor`
   - 목표:
     - `view_mode/all_checksum/view_checksum` 판정을 descriptor 기반으로 단일화.
2. 메타 descriptor 기반 리팩터링.
   - 대상:
     - `buildOfflineDetailCompareComparableOutcomeDescriptor`
     - `buildOfflineDetailCompareViewModeAlignmentDescriptor`
     - `buildOfflineDetailCompareCodeDeltaSummaryTone`
   - 목표:
     - 동일 메타 분기(보기 모드/체크섬)를 공통 descriptor 경로로 통일.
3. 회귀 체크 추가.
   - 대상 파일: `/Users/hirediversity/Idle/scripts/check_mobile_mvp_slice_regression_v1.mjs`
   - 제안 시나리오 id:
     - `offline_detail_compare_meta_match_descriptors_are_stable`
     - `offline_detail_compare_meta_descriptor_usage_matches_state`
4. 문서 동기화.
   - `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`에 신규 헬퍼/검증 항목 반영.
   - `/Users/hirediversity/Idle/docs/idle_xianxia_design_v0.3_kr.md`에 `476)`, `477)` 섹션 추가.

## 4) 완료 기준 (Definition of Done)
- 엔진 코드에서 대상 분기가 descriptor 헬퍼를 통해서만 결정됨.
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
1) buildOfflineDetailCompareMetaMatchDescriptors / buildOfflineDetailCompareMetaMatchDescriptor 를 추가해서 view_mode/all_checksum/view_checksum 분기를 descriptor 기반으로 통합
2) buildOfflineDetailCompareComparableOutcomeDescriptor / buildOfflineDetailCompareViewModeAlignmentDescriptor / buildOfflineDetailCompareCodeDeltaSummaryTone 이 위 descriptor를 사용하도록 리팩터링
3) scripts/check_mobile_mvp_slice_regression_v1.mjs 에 descriptor 안정성/사용 일관성 시나리오 2개 추가
   - offline_detail_compare_meta_match_descriptors_are_stable
   - offline_detail_compare_meta_descriptor_usage_matches_state
4) docs/system/mobile_mvp_vertical_slice_v1_kr.md 와 docs/idle_xianxia_design_v0.3_kr.md(476/477) 동기화

작업 방식:
- 새 브랜치 생성: codex/offline-compare-meta-match-descriptor-v1
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
