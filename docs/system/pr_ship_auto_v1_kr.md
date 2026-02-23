# PR 원클릭 Ship 자동화 v1

기준 시점: 2026-02-23  
대상 파일:
- `/Users/hirediversity/Idle/scripts/ship_pr_auto_v1.py`

## 1) 목적
- PR 생성과 머지를 하나의 커맨드로 묶어 반복 수작업을 최소화한다.
- 실수로 본문이 비거나 체크 확인 없이 머지되는 흐름을 줄인다.

## 2) 기본 실행
```bash
cd /Users/hirediversity/Idle
npm run pr:ship:auto
```

## 3) 내부 단계
1. `create_pr_with_body_v1.py` 실행
   - PR 본문 자동 생성
   - 검증 실행(`--run-validation`)
   - 브랜치 푸시
   - PR 생성/업데이트
2. `review_pr_auto_v1.py` 실행(기본 활성화)
   - 대상 PR 자동 승인 시도(best-effort)
3. `merge_pr_when_ready_v1.py` 실행
   - Required Check 대기
   - squash 머지
   - 브랜치 삭제(기본)

## 4) 주요 옵션
- `--no-run-validation`: 본문 생성 단계 검증 생략
- `--no-push`: PR 생성 전 push 생략
- `--no-review`: 자동 승인 단계 생략
- `--require-review`: 자동 승인 실패 시 ship 즉시 실패
- `--review-body "<text>"`: 승인 코멘트 커스터마이즈
- `--keep-branch`: 머지 후 브랜치 삭제 생략
- `--no-auto-on-blocked`: direct merge 실패 시 `--auto` 재시도 비활성화
- `--dry-run`: 실행 계획만 출력

## 5) 비고
- 현재 브랜치가 `main`이면 생성 단계에서 실패한다(안전 장치).
- 팀 규칙(리뷰 승인/대화 해결)은 브랜치 보호 정책을 그대로 따른다.
