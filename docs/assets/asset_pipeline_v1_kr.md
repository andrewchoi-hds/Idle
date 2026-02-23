# Free Asset 파이프라인 v1

## 1) 입력 데이터
- 후보군 표: `/Users/hirediversity/Idle/data/assets/free_asset_candidates_v1.csv`

## 2) 채택 규칙
- `recommended`: 바로 채택 가능.
- `conditional`: 라이선스 조건 재검토 후 채택.
- `high risk`: ShareAlike/GPL 영향 범위 확인 전에는 프로덕션 제외.

## 3) 기술 규격 통일
- 기본 픽셀 기준: 32x32.
- 16x16 에셋은 2배 업스케일 후 수동 리터치.
- 팔레트 통일: 24~32색 제한, 음영 단계 3단 고정.

## 4) 라이선스 체크리스트
1. 상업 사용 가능 여부.
2. 크레딧 의무 여부.
3. 수정/2차 배포 허용 범위.
4. AI 학습 금지 등 추가 제한.
5. ShareAlike/GPL 전염 가능성.

## 5) 산출물
- `/Users/hirediversity/Idle/docs/assets/ASSET_LICENSE.md` (추후 작성)
- `/Users/hirediversity/Idle/data/assets/free_asset_candidates_v1.csv` 유지 업데이트
