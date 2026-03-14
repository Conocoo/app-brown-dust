# CLAUDE.md — 브라운더스트 전투 시뮬레이터

> 공통 행동 지침(1~5)은 상위 폴더 CLAUDE.md 참조.

## 기술스택
- React 19 + TypeScript 5.7 + Vite 6
- 상태관리: React useState (외부 라이브러리 없음)
- TypeScript strict 모드 (`noUnusedLocals`, `noUnusedParameters` 활성화 — 사용하지 않는 변수/파라미터는 컴파일 에러)

## 핵심 구조
- `src/types/` — 타입 정의 (game.ts, skill.ts, mercenary.ts)
- `src/data/mercenaries/(3star|4star|5star)/` — 용병 데이터
- `src/data/skills/` — 스킬 템플릿 데이터
- `src/logic/` — 전투 로직 (turn.ts, damage.ts, targeting.ts, battle.ts, rune.ts)
- `src/components/` — UI 컴포넌트 (App.tsx가 메인 오케스트레이터)
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
- 용병 스킬: `MercenarySkillRef`로 스킬 ID 참조 + effects 오버라이드 → `resolveSkills()`로 병합
- 스킬 타이밍: `before_attack` (공격 전 발동) | `after_attack` (공격 후 발동) | `passive` (전투 시작 시 1회)

## 전투 로직 흐름 (src/logic/)
- `battle.ts`: 시뮬레이션 진입점. 패시브 적용 → 라운드 루프 (최대 100) → 교대 턴
- `turn.ts`: 턴 실행. DoT/회복 처리 → before_attack 스킬 → 일반 공격 → after_attack 스킬
- `targeting.ts`: 타겟 선택. focus_fire → taunt → attackTarget 우선순위. 8가지 범위 패턴
- `damage.ts`: 데미지 공식. 버프/디버프 반영, 크리티컬/그레이즈, 쉴드 감소
- `rune.ts`: 룬 스탯 합산 및 캐릭터 스탯 적용

## 게임 단계 (GamePhase)
`placing` (배치) → `ordering` (순서 설정) → `battling` (전투 재생) → `result` (결과)

## 커맨드
- `npm run dev` — 개발 서버
- `npm run build` — 타입 체크 + 빌드
- `npm run validate` — 타입 체크만 (빠른 검증)
- `npm run create-skill -- --config <file.json>` — 스킬 자동 생성
- `npm run create-mercenary -- --config <file.json>` — 용병 자동 생성

## 문서 동기화
코드 변경 시 관련 문서 함께 업데이트:
- `Docs/스킬-목록.md` — 스킬 추가/수정 시
- `Docs/폴더-구조.md` — 파일 추가/삭제 시
- `Docs/전투-시스템-가이드.md` — 전투 로직 변경 시

## 파일 네이밍
- 스킬 ID: snake_case (`advanced_burn`)
- 스킬 파일명: kebab-case (`advanced-burn.ts`)
- 변수명: camelCase (`advancedBurn`)
- 용병 ID/파일명: 영문 소문자 (`carlson`)
