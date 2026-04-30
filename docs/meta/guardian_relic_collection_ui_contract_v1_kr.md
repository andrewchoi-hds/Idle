# 호법/법보 수집 UI / 장착 UX contract v1

기준 시점: 2026-04-29

## 1) 목적
- `호법/법보` 수집 레이어를 플레이어가 실제로 보게 될 UI 구조를 고정한다.
- 무료 수급, 중복 전환, 장착, 향후 가챠/배너 확장을 한 레일 위에 올린다.
- collection layer가 `파워 판매 UI`처럼 보이지 않도록 UX 가드레일을 미리 정한다.

## 2) 화면 구조

### 상위 패널
- `collectionPanel`
  - 수집 허브 루트
- 하위 탭
  - `guardianCollectionTab`
  - `relicCollectionTab`
  - `collectionExchangeTab`
  - `collectionJournalTab`

### 헤더 메타
- 표시 항목
  - 현재 탭
  - `collection_shard`
  - `collection_token`
  - 현재 pity
  - 오늘 무료 수급 상태
- 원칙
  - 무료 진척 정보가 유료 진척 정보보다 먼저 보여야 한다.

## 3) Guardian UX

### 로스터 영역
- `guardianRosterGrid`
  - 카드 리스트
- 원칙
  - 고정 샘플 카드가 아니라 export row 전체를 기준으로 렌더한다.
  - 카드에서 이름, rarity, 보유 여부, 잠금 난이도, 대표 효과를 바로 읽을 수 있어야 한다.
- 카드 1개 contract
  - `data-guardian-id`
  - `data-rarity`
  - `data-owned`
  - `data-duplicate-count`
  - `data-effect-lane`
  - `data-effect-type`
  - `data-effect-value`
  - `data-equip-state`
  - `data-slot-eligible`

### 상세 패널
- `guardianDetailPanel`
  - 이름
  - rarity
  - 효과 lane
  - 효과 설명
  - 중복 수
  - shard 환산값
  - 획득처 힌트

### 장착 UX
- `guardianLoadoutPanel`
  - `guardianSlotPrimary`
  - `guardianSlotSecondary`
- 규칙
  - 기본은 1슬롯만 개방
  - 2슬롯은 별도 unlock
  - 같은 guardian 중복 장착 금지
  - 장착/해제는 즉시 반영

### 주요 액션
- `btnEquipGuardianPrimary`
- `btnEquipGuardianSecondary`
- `btnUnequipGuardian`
- `btnConvertGuardianDuplicate`

## 4) Relic UX

### 아카이브 영역
- `relicArchiveGrid`
  - 법보 카드 리스트
- 원칙
  - 고정 샘플 카드가 아니라 export row 전체를 기준으로 렌더한다.
  - 카드에서 이름, rarity, 보유 여부, 잠금 난이도, 대표 효과를 바로 읽을 수 있어야 한다.
- 카드 1개 contract
  - `data-relic-id`
  - `data-rarity`
  - `data-owned`
  - `data-duplicate-count`
  - `data-theme`
  - `data-effect-lane`
  - `data-activation-rule`
  - `data-equip-state`

### 상세 패널
- `relicDetailPanel`
  - 이름
  - rarity
  - 규칙 변형 효과
  - activation rule
  - duplicate conversion
  - recommended lane

### 장착 UX
- `relicLoadoutPanel`
  - `relicSlotPrimary`
  - `relicSlotSecondary`
- 규칙
  - 기본 1슬롯
  - 후반부에 2슬롯 unlock
  - 같은 theme 중첩은 제한 가능
  - 장착 effect는 direct stat보다 rule modifier 중심

### 주요 액션
- `btnEquipRelicPrimary`
- `btnEquipRelicSecondary`
- `btnUnequipRelic`
- `btnConvertRelicDuplicate`

## 5) 무료 수급 UX

### 노출 위치
- `collectionFreeSourcesPanel`
  - `collectionFreeSourceList`
  - main/milestone/daily/weekly/event exchange row 전체

### 행 contract
- `data-source-id`
- `data-source-type`
- `data-cycle`
- `data-entry-ref`
- `data-reward-kind`
- `data-reward-ref`
- `data-claim-state`
- `data-source-state`

### 원칙
- 무료 수급 경로는 항상 "어디서 얻는지"가 보여야 한다.
- collection layer가 막혀 보이지 않게 `다음 무료 확보 경로`를 명확히 표시한다.
- daily/weekly는 영구 소모가 아니라 cycle-aware claim 기준으로 다시 열려야 한다.
- `entry_ref`는 raw id를 그대로 노출하지 말고, 가능하면 quest/milestone 이름과 목표 문장으로 번역해서 보여 준다.
- `reach_difficulty`처럼 현재 state로 확실히 계산 가능한 entry는 `진행 중 / 목표 달성 / 수령 완료`를 실제 진행 기준으로 보여 준다.
- `survive_tribulation` 계열도 현재 state에서 카운트가 잡히면 같은 방식으로 실제 progress를 보여 준다.
- 아직 자동 추적되지 않는 source는 `수령 가능`로 가장하지 말고 `manual` 상태로 분리해 `확인 수령` 또는 `교환` 문맥으로 보여 준다.
- `kill_boss` 계열은 현재 MVP에서 `boss-class battle` proxy(도겁 단계 또는 perfect phase 전투 승리)로 추적한다는 점을 명시적으로 유지한다.
- `kill_elite` 계열은 현재 MVP에서 `elite-class battle` proxy(late phase non-tribulation 전투 승리)로 추적한다는 점을 명시적으로 유지한다.
- `collect_item_count / collect_item` 계열은 현재 MVP에서 `inventory proxy`(영약=`breakthroughElixir`, 부적=`tribulationTalisman`)로 추적한다는 점을 명시적으로 유지한다.
- `clear_zone / clear_node` 계열은 현재 MVP에서 quest `recommended_difficulty_max`를 진행 proxy로 사용한다는 점을 명시적으로 유지한다.
- `event_exchange` 계열은 현재 MVP에서 `collection_token`을 사용하는 exchange proxy(필요 토큰=`reward_qty`)로 추적한다는 점을 명시적으로 유지한다.

## 6) 중복 전환 UX

### 중복 전환 패널
- `collectionDuplicatePanel`
  - guardian/relic 구분
  - rarity별 전환 결과
  - pity progress 설명

### contract
- `data-source-kind`
- `data-rarity`
- `data-yield-shard`
- `data-yield-token`
- `data-pity-progress`
- `data-convert-disabled`

### UX 원칙
- 중복은 손해가 아니라 누적 진척으로 읽혀야 한다.
- 전환 전/후 결과를 수치로 바로 보여 준다.

## 7) 향후 가챠/배너 확장 포인트

### 아직 넣지 않지만 미리 고려할 영역
- `collectionBannerPanel`
- `collectionBannerPity`
- `btnPullGuardian`
- `btnPullRelic`
- `btnOpenExchange`

### 가드레일
- 무료 수급 패널과 같은 화면에 있어야 한다.
- pity / 중복 전환 / 교환 상점 링크가 배너보다 더 아래에 숨으면 안 된다.
- pay-only UI처럼 보이지 않도록:
  - 무료 획득 경로
  - pity 진행
  - duplicate conversion
  가 같이 노출되어야 한다.

## 8) mobile MVP용 최소 contract
- 지금 당장 MVP에 붙일 최소 범위는:
  - collection header meta
  - guardian/relic 1탭
  - 장착 슬롯 1개씩
  - 무료 수급 리스트
  - duplicate conversion summary
- full gacha banner는 이 최소 범위 이후

## 9) 연결해야 할 기존 데이터
- 호법: `/Users/hirediversity/Idle/data/meta/guardians_v1.csv`
- 법보: `/Users/hirediversity/Idle/data/meta/relics_v1.csv`
- 중복 전환: `/Users/hirediversity/Idle/data/meta/collection_duplicate_conversion_v1.csv`
- 무료 수급: `/Users/hirediversity/Idle/data/meta/collection_free_sources_v1.csv`

## 10) 아직 비어 있는 레일
- `collection_token`
- `collection_shard`
- `guardian_core / guardian_advanced`
- `relic_core / relic_advanced`
- `event_exchange_001`

위 항목은 economy/event schema 쪽 후속 작업이 필요하다.

## 11) 구현 순서 제안
1. collection meta currency schema 보강
2. free source claim/read model 추가
3. guardian/relic loadout state schema 추가
4. minimal collection panel UI 추가
5. duplicate conversion UX 추가
6. 그 뒤 collection banner 여부 결정

## 12) 현재 MVP 연결 범위
- starter guardian/relic 1개씩 기본 지급
- 탭 전환 state 저장
- guardian/relic 카드 선택
- 주 슬롯 장착/해제
- 장착/비장착 상태 summary 반영
- 아직 없는 것:
  - free source 실제 claim
  - duplicate conversion 계산
  - secondary slot unlock
  - banner/pity 소비 루프
