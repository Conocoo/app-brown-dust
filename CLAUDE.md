# CLAUDE.md — 브라운더스트 전투 시뮬레이터

> 공통 행동 지침(1~5)은 상위 폴더 CLAUDE.md 참조.

## 작업 시작 전 필독

**`../Docs/구현-현황.md`를 먼저 확인한다.** 이 파일에 구현 요청 항목이 있으면 별도 지시 없이 그것부터 처리한다.

구현 중 RE 쪽 정보가 필요하면 `📬 시뮬레이터 → RE` 섹션에 기록한다 (무엇이 불명확한지 + 어느 파일을 보면 될지 구체적으로).

## 기술스택
- React 19 + TypeScript 5.7 + Vite 6
- 상태관리: React useState (외부 라이브러리 없음)
- TypeScript strict 모드 (`noUnusedLocals`, `noUnusedParameters` 활성화 — 사용하지 않는 변수/파라미터는 컴파일 에러)

## 핵심 구조
- `src/types/` — 타입 정의 (game.ts, skill.ts, mercenary.ts)
- `src/data/mercenaries/(3star|4star|5star)/` — 용병 데이터
- `src/data/skills/` — 스킬 템플릿 데이터
- `src/logic/` — 전투 로직 (turn.ts, damage.ts, targeting.ts, battle.ts, rune.ts)
- `src/components/` — UI 컴포넌트 (App.tsx가 메인 오케스트레이터, MercenaryDex/SkillDex 도감)
- `scripts/` — 자동화 스크립트 (create-skill.mjs, create-mercenary.mjs)
- `Docs/` — 프로젝트 문서
- `TODO/` — 작업 계획서 (완료 후 항목 제거)

## 아키텍처: 로그 기반 시뮬레이션
전투는 **순수 함수**로 실행되어 결정론적 로그 배열(`BattleLogEntry[]`)을 반환하고, UI는 이 로그를 재생하여 상태를 재구성하는 구조:
1. `MercenaryTemplate` (정적 데이터) → `BattleCharacter` (런타임 인스턴스) 변환
2. `simulateBattle()` → 전체 전투를 한번에 실행하여 로그 반환
3. `applyLogToGrid()` → 로그를 순차 재생하여 UI 업데이트 (속도 조절, 수동 스텝 지원)

## 데이터 레이어: 레지스트리 패턴
- 스킬/용병 모두 Map 기반 `register()` + `getById()` 패턴
- **스킬 추가 시**: 스킬 파일 생성 → `src/data/skills/index.ts`에 import + `register()` 호출 추가
- **용병 추가 시**: 용병 파일 생성 → `src/data/mercenaries/index.ts`에 import + `register()` 호출 추가
- 용병 스킬: `MercenarySkillRef`로 스킬 ID 참조 + effects 오버라이드 → `resolveSkills()`로 병합 (**배열 인덱스 순서로 얕은 병합** — 순서 틀리면 잘못된 효과에 적용됨)
- 스킬 타이밍: `before_attack` (공격 전 발동) | `after_attack` (공격 후 발동) | `passive` (전투 시작 시 1회, allSorted 순서로 적용)
- 스킬 효과 스케일링: `atkScaling: true` → 실제값 = `value × (atk / 100)` | `spScaling: true` → 실제값 = `value × (supportPower / 100)`
- 상태효과 채널: `channel: 'multiply'` (기본, 배율 합산 후 클램프) | `channel: 'plus'` (수치 합산)

## 전투 로직 흐름 (src/logic/)
- `battle.ts`: 시뮬레이션 진입점. 패시브 적용 → 라운드 루프 (최대 100) → 교대 턴. **`support` 타입은 생존자 계산에서 제외** (승패 조건에 영향 없음)
- `turn.ts`: 턴 실행. DoT/회복 처리 → before_attack 스킬 → 일반 공격 → after_attack 스킬. 상태효과 ID는 `nextEffectId()`로 생성 (전역 카운터, 형식: `eff_N`)
- `targeting.ts`: 타겟 선택. focus_fire → taunt → attackTarget 우선순위. 8가지 범위 패턴. 그리드: 3행×12열 (플레이어 0-5열, 적 6-11열)
- `damage.ts`: ATK 버프/디버프 클램프 `[-80%, +300%]`. 크리티컬/그레이즈, 쉴드 감소
- `rune.ts`: 룬 스탯 합산 및 캐릭터 스탯 적용

## 게임 단계 (GamePhase)
`home` (홈) → `placing` (배치) → `ordering` (순서 설정) → `battling` (전투 재생) → `result` (결과)
- 홈 화면에서 `activeTab`으로 전투(`main`) / 용병 도감(`mercenary_dex`) / 스킬 도감(`skill_dex`) 전환

## 커맨드
- `npm run dev` — 개발 서버
- `npm run build` — 타입 체크 + 빌드
- `npm run preview` — 프로덕션 빌드 미리보기
- `npm run validate` — 타입 체크만 (빠른 검증)
- `npm run create-skill -- --config <file.json>` — 스킬 자동 생성
- `npm run create-mercenary -- --config <file.json>` — 용병 자동 생성
- `npm run generate-docs` — 스킬/용병 데이터 기반으로 Docs 자동 갱신

> 테스트 프레임워크 없음 — 검증은 `npm run validate` (타입 체크)만 사용

## 문서 동기화
코드 변경 시 관련 문서 함께 업데이트:
- `Docs/스킬-목록.md` — **자동 생성** (`npm run generate-docs`). 직접 편집 금지
- `Docs/용병-목록.md` — **자동 생성** (`npm run generate-docs`). 직접 편집 금지
- `Docs/폴더-구조.md` — 파일 추가/삭제 시 (수동)
- `Docs/전투-시스템-가이드.md` — 전투 로직 변경 시 (수동)
- `Docs/게임-사용법.md` — UI/기능 변경 시 (수동)
- `README.md` — 컨텐츠 수량(용병/스킬 수) 변경 시 (수동)

## 이미지 리소스
- 초상화: `public/images/portraits/char{imageId}icon.png`
- 썸네일: `public/images/thumbnails/char{imageId}icon.png`
- 미사용: `public/images/not_use/` (새 용병 추가 시 여기서 portraits/thumbnails로 복사)
- 용병의 `imageId`는 **숫자만** 사용 (`'515'`), 경로 조합은 `char${imageId}icon.png`

## 파일 네이밍
- 스킬 ID: snake_case (`advanced_burn`)
- 스킬 파일명: kebab-case (`advanced-burn.ts`)
- 변수명: camelCase (`advancedBurn`)
- 용병 ID/파일명: 영문 소문자 (`carlson`)
