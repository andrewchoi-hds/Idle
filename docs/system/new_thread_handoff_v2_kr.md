# 새 쓰레드 인수인계 (Mobile MVP v1, 2026-03-03 업데이트)

## 1) 현재 스냅샷
- 저장소: `/Users/hirediversity/Idle`
- 현재 작업 브랜치: `codex/mobile-battle-loop-next-v17`
- 기준 HEAD: `5354f35` (`origin/main`과 동일)
- 최근 머지 PR: `#212` ([feat: add lead resonance pulses for sustained control](https://github.com/andrewchoi-hds/Idle/pull/212))
- 워킹트리 상태: tracked 변경 없음, untracked만 존재
  - `.playwright-cli/`
  - `output/`

## 2) 최근 완료 범위 (연출 코어 클러스터)
- `#201 ~ #212` 연속 머지 완료 (전투 연출 상시 동적화 클러스터)
- 핵심 머지 순서 (최근 12개):
  - #201 combo banner
  - #202 shockwave layer
  - #203 hit-stop
  - #204 cast telegraph
  - #205 cast orbit mote
  - #206 lead swing transition
  - #207 pressure spike
  - #208 danger pulse
  - #209 combo surge transition
  - #210 combo cooldown transition
  - #211 combo resonance sustain
  - #212 lead resonance sustain
- 설계 로그 반영 구간:
  - `/Users/hirediversity/Idle/docs/idle_xianxia_design_v0.3_kr.md`
  - `500) ~ 533)`
- 시스템 가이드 반영 위치:
  - `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`
  - 전투 연출 bullet 블록(약 145~176행)

## 3) 현재 구현도 (추정)
- 모바일 전투 연출 루프 동적화: **약 80%**
  - 상시 루프/전환 이벤트/유지 공명(lead/combo/pressure/danger/cast)까지 반영됨
- 실제 게임 엔진 값과의 정합(실제 전투 결과-연출 1:1 연동): **약 55%**
  - 연출은 매우 동적이나, 일부는 시뮬레이션성 루프(ambient) 기반
- 전투 에셋 다양성/완성도: **약 35%**
  - 프레임 에셋/기본 레이어는 있음, 고품질 아트셋/연출 다양화는 남음
- 전체 모바일 vertical slice 체감: **약 65~70%**

## 4) 남은 작업 우선순위 큐 (새 쓰레드 시작용)
1. **엔진-연출 정합 강화 (최우선)**
   - 목표: `runBattleOnce / runBreakthroughAttempt` 결과와 battle scene 이벤트를 더 직접 매핑
   - 제안:
     - 수치 변화(피해/승패/치명/돌파 결과) → HUD/티커/이펙트 강도에 deterministic 반영
     - ambient 랜덤 이벤트 비중 축소, 실제 결과 기반 트리거 우선
2. **연출 상태 지속 계층 확장**
   - 목표: 전환(transition) + 유지(sustain) + 종료(fade-out) 3단계 완성
   - 제안:
     - pressure/ danger도 `resonance` 계열 유지 이펙트 추가
     - 상충 클래스 정리(동시 점등 시 우선순위 규칙 명시)
3. **모바일 성능 가드/밀도 제어**
   - 목표: 저사양 기기에서 프레임 저하 없이 유지
   - 제안:
     - mode별 파티클/트레일/쇼크웨이브 상한 동적 제한
     - `prefers-reduced-motion` 외 `low-performance` 토글(수동) 도입 검토
4. **시각 에셋 보강**
   - 목표: 텍스트 중심 인상을 줄이고 아트 존재감 강화
   - 제안:
     - 월드/티어별 배경 variant 추가
     - actor skill/hit 전용 추가 레이어(검기, 잔상, 코어 플레어)
5. **문서/회귀체계 지속 동기화**
   - 목표: 슬라이스 1개당 설계 로그 + system guide + DOM contract 동시 반영 유지

## 5) 완료 기준 (Definition of Done)
- 엔진-연출 연결 슬라이스 1개 이상 구현(실제 결과 기반 트리거 강화)
- 아래 검증 전부 통과:
  - `npm run typecheck`
  - `npm run mobile:mvp:dom:check`
  - `npm run mobile:mvp:check`
- 문서 2곳 동기화:
  - `/Users/hirediversity/Idle/docs/system/mobile_mvp_vertical_slice_v1_kr.md`
  - `/Users/hirediversity/Idle/docs/idle_xianxia_design_v0.3_kr.md`
- PR 생성 및 머지 후, 다음 작업 브랜치로 이동

## 6) 새 쓰레드 시작 프롬프트 (복붙용)
```text
/Users/hirediversity/Idle 기준으로 Mobile MVP v1 다음 슬라이스를 진행해줘.

현재 기준:
- origin/main 최신 머지: PR #212 (lead resonance sustain)
- 설계 로그 최신 섹션: docs/idle_xianxia_design_v0.3_kr.md 의 533)
- system guide 전투 연출 bullet이 최신 반영 상태

이번 목표(최우선):
1) 엔진-연출 정합 강화 슬라이스 1개 구현
   - runBattleOnce / runBreakthroughAttempt 결과를 battle scene 트리거에 더 직접 연결
   - ambient 랜덤 트리거 비중을 줄이고 실제 결과 기반 반영 우선
2) DOM contract + 문서 동기화
   - scripts/check_mobile_mvp_dom_contract_v1.mjs
   - docs/system/mobile_mvp_vertical_slice_v1_kr.md
   - docs/idle_xianxia_design_v0.3_kr.md (다음 번호 섹션 추가)
3) 검증 후 PR/머지

작업 방식:
- 브랜치 생성: codex/mobile-battle-loop-next-v18 (origin/main 기준)
- 구현 후 검증:
  - npm run typecheck
  - npm run mobile:mvp:dom:check
  - npm run mobile:mvp:check
- PR 생성:
  - python3 scripts/create_pr_with_body_v1.py --base main --run-validation --allow-dirty --no-push
- 머지:
  - npm run pr:merge:auto
```

## 7) 주의사항
- `.playwright-cli/`, `output/`는 현재 untracked 상태이므로 건드리지 않기.
- 기존 슬라이스 규칙 유지:
  - 기능 구현 + contract + 문서 동기화를 한 묶음으로 처리
  - 머지 후 다음 `codex/mobile-battle-loop-next-v*` 브랜치로 바로 전환
