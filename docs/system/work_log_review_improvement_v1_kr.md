# 작업 기록·검토·개선 점검 v1

기준 시점: 2026-02-23  
대상 범위: `/Users/hirediversity/Idle` 전투/검증/CI 파이프라인

## 1) 작업 기록 요약
1. 밸런스/저장 계층
   - `save_v2` 검증기/실패 케이스/마이그레이션 골격 정리.
   - economy profile(`base|tuned`) 런타임 가드 및 일관성 점검 스크립트 추가.
2. 전투 루프 확장
   - TS 최소 전투 루프에 상성/상태이상(`burn/slow/stun`) 반영.
   - 몬스터 `special_mechanic` 확장 반영(선공/처형/흡혈/on-hit 상태이상/패시브).
   - 전투 로그에 `elementMultiplier`, `statusApplied`, `selfHeal` 계열 지표 추가.
3. TS/PY 동기화
   - Python 시뮬레이터를 TS 규칙에 맞춰 동기화.
   - RNG를 TS와 동일한 `xorshift32`로 통일.
   - 반올림 규칙을 JS `Math.round`/`toFixed` 기준으로 통일.
4. 자동 검증 체계
   - TS 덤프 + TS/PY diff 스크립트 구축.
   - 단일 시나리오 diff에서 다중 시나리오 스위트(인간/신선/진선)로 확장.
   - GitHub Actions(`verify-combat-diff`)에서 `typecheck` + diff suite 자동 실행 연결.
5. 운영 문서화
   - README, CI 운영, Required Check 설정 가이드 정리.

## 2) 검토 결과 (Findings)
1. [P2] 시나리오 입력 형식 오염 방어 부족 (해결됨)
   - 현상: `skill_ids`, `monster_ids`, `include_action_log`가 잘못된 타입일 때 예측 불가 동작 가능.
   - 조치: 시나리오/CLI 입력 검증 및 bool 파서 추가.
   - 반영 위치: `/Users/hirediversity/Idle/scripts/compare_minimal_combat_ts_py_v1.py:82`, `/Users/hirediversity/Idle/scripts/compare_minimal_combat_ts_py_v1.py:108`, `/Users/hirediversity/Idle/scripts/compare_minimal_combat_ts_py_v1.py:149`
2. [P3] README CI 배지가 템플릿 상태 (미해결, 환경의존)
   - 현상: `<OWNER>/<REPO>` placeholder를 치환하지 않으면 배지가 동작하지 않음.
   - 반영 위치: `/Users/hirediversity/Idle/README.md:7`
   - 필요 조치: 실제 원격 저장소 경로로 배지 URL 치환.

## 3) 개선사항 점검표
1. 완료: TS/PY 전투 결과 완전 정합(3개 월드 시나리오) 확보.
   - 검증: `npm run combat:diff:py-ts:suite`
2. 완료: CI에서 정합성 게이트 자동 실행.
   - 워크플로우: `/Users/hirediversity/Idle/.github/workflows/combat-diff-ci.yml`
3. 진행 필요: Branch Protection에서 `verify-combat-diff`를 Required Check로 강제.
   - 가이드: `/Users/hirediversity/Idle/docs/system/github_required_checks_v1_kr.md`
4. 진행 필요: README 배지 URL 실제 저장소 경로 치환.
5. 선택 개선: CI 결과물(JSON 리포트) artifact 업로드 추가.
   - 목적: 실패 시 시나리오별 결과 비교를 웹 UI에서 즉시 확인.

## 4) 재검증 결과
1. `npm run typecheck` 통과
2. `npm run combat:diff:py-ts:suite` 통과
