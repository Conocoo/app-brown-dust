# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

LLM의 흔한 코딩 실수를 줄이기 위한 행동 지침. 프로젝트별 지시사항과 병합하여 사용.

**트레이드오프:** 이 지침은 속도보다 신중함에 무게를 둡니다. 간단한 작업에는 판단에 따라 유연하게 적용하세요.

## 1. 코딩 전에 생각하기

**추측하지 말 것. 혼란을 숨기지 말 것. 트레이드오프를 드러낼 것.**

구현 전에:
- 가정을 명시적으로 밝힐 것. 불확실하면 질문할 것.
- 여러 해석이 가능하면 모두 제시할 것 — 임의로 선택하지 말 것.
- 더 간단한 방법이 있으면 말할 것. 필요하면 반대 의견을 낼 것.
- 불분명한 것이 있으면 멈출 것. 무엇이 헷갈리는지 말하고 질문할 것.

## 2. 단순함 우선

**문제를 해결하는 최소한의 코드. 추측성 코드는 없앨 것.**

- 요청받지 않은 기능은 추가하지 말 것.
- 한 번만 쓰이는 코드에 추상화를 만들지 말 것.
- 요청되지 않은 "유연성"이나 "설정 가능성"을 넣지 말 것.
- 발생 불가능한 시나리오에 대한 에러 처리를 하지 말 것.
- 200줄로 작성한 것이 50줄로 가능하면, 다시 작성할 것.

스스로에게 물어볼 것: "시니어 엔지니어가 이걸 보고 '너무 복잡하다'고 할까?" 그렇다면 단순화할 것.

## 3. 최소한의 변경

**필요한 것만 건드릴 것. 자신이 만든 문제만 정리할 것.**

기존 코드를 수정할 때:
- 주변 코드, 주석, 포맷팅을 "개선"하지 말 것.
- 고장나지 않은 것을 리팩토링하지 말 것.
- 자신이라면 다르게 했더라도 기존 스타일에 맞출 것.
- 관련 없는 죽은 코드를 발견하면 언급만 할 것 — 삭제하지 말 것.

변경으로 인해 고아가 생겼을 때:
- 자신의 변경으로 사용되지 않게 된 import/변수/함수는 제거할 것.
- 기존에 있던 죽은 코드는 요청받지 않는 한 제거하지 말 것.

검증 기준: 변경된 모든 줄이 사용자의 요청에 직접 연결되어야 함.

## 4. 목표 중심 실행

**성공 기준을 정의할 것. 검증될 때까지 반복할 것.**

작업을 검증 가능한 목표로 변환:
- "유효성 검사 추가" → "잘못된 입력에 대한 테스트를 작성하고 통과시키기"
- "버그 수정" → "버그를 재현하는 테스트를 작성하고 통과시키기"
- "X 리팩토링" → "리팩토링 전후로 테스트가 통과하는지 확인"

여러 단계의 작업이면 간단한 계획을 세울 것:
```
1. [단계] → 검증: [확인사항]
2. [단계] → 검증: [확인사항]
3. [단계] → 검증: [확인사항]
```

## 5. 최신화 및 동기화

**코드와 설명은 일치해야한다.**
- 수정한 코드가 있다면 그에 맞게 md 파일도 같이 수정해야한다.
- 만약 TODO 폴더에 md 파일 내용대로 수정해달라고 요청한경우, 요청이 완료된 항목은 제거해야한다.

명확한 성공 기준이 있으면 독립적으로 반복 작업이 가능. 약한 기준("되게 해줘")은 지속적인 확인이 필요.

---

**이 지침이 잘 작동하고 있다면:** diff에 불필요한 변경이 줄어들고, 과도한 복잡성으로 인한 재작성이 줄어들며, 실수 후가 아닌 구현 전에 명확한 질문이 나옴.

---

## 프로젝트: 브라운더스트 전투 시뮬레이터

### 기술스택
- React 19 + TypeScript 5.7 + Vite 6
- 상태관리: React useState (외부 라이브러리 없음)
- TypeScript strict 모드 (`noUnusedLocals`, `noUnusedParameters` 활성화 — 사용하지 않는 변수/파라미터는 컴파일 에러)

### 핵심 구조
- `src/types/` — 타입 정의 (game.ts, skill.ts, mercenary.ts)
- `src/data/mercenaries/(3star|4star|5star)/` — 용병 데이터
- `src/data/skills/` — 스킬 템플릿 데이터
- `src/logic/` — 전투 로직 (turn.ts, damage.ts, targeting.ts, battle.ts, rune.ts)
- `src/components/` — UI 컴포넌트 (App.tsx가 메인 오케스트레이터)
- `scripts/` — 자동화 스크립트 (create-skill.mjs, create-mercenary.mjs)
- `Docs/` — 프로젝트 문서
- `TODO/` — 작업 계획서 (완료 후 항목 제거)

### 아키텍처: 로그 기반 시뮬레이션
전투는 **순수 함수**로 실행되어 결정론적 로그 배열(`BattleLogEntry[]`)을 반환하고, UI는 이 로그를 재생하여 상태를 재구성하는 구조:
1. `MercenaryTemplate` (정적 데이터) → `BattleCharacter` (런타임 인스턴스) 변환
2. `simulateBattle()` → 전체 전투를 한번에 실행하여 로그 반환
3. `applyLogToGrid()` → 로그를 순차 재생하여 UI 업데이트 (속도 조절, 수동 스텝 지원)

### 데이터 레이어: 레지스트리 패턴
- 스킬/용병 모두 Map 기반 `register()` + `getById()` 패턴
- **스킬 추가 시**: 스킬 파일 생성 → `src/data/skills/index.ts`에 import + `register()` 호출 추가
- **용병 추가 시**: 용병 파일 생성 → `src/data/mercenaries/index.ts`에 import + `register()` 호출 추가
- 용병 스킬: `MercenarySkillRef`로 스킬 ID 참조 + effects 오버라이드 → `resolveSkills()`로 병합
- 스킬 타이밍: `before_attack` (공격 전 발동) | `after_attack` (공격 후 발동) | `passive` (전투 시작 시 1회)

### 전투 로직 흐름 (src/logic/)
- `battle.ts`: 시뮬레이션 진입점. 패시브 적용 → 라운드 루프 (최대 100) → 교대 턴
- `turn.ts`: 턴 실행. DoT/회복 처리 → before_attack 스킬 → 일반 공격 → after_attack 스킬
- `targeting.ts`: 타겟 선택. focus_fire → taunt → attackTarget 우선순위. 8가지 범위 패턴
- `damage.ts`: 데미지 공식. 버프/디버프 반영, 크리티컬/그레이즈, 쉴드 감소
- `rune.ts`: 룬 스탯 합산 및 캐릭터 스탯 적용

### 게임 단계 (GamePhase)
`placing` (배치) → `ordering` (순서 설정) → `battling` (전투 재생) → `result` (결과)

### 커맨드
- `npm run dev` — 개발 서버
- `npm run build` — 타입 체크 + 빌드
- `npm run validate` — 타입 체크만 (빠른 검증)
- `npm run create-skill -- --config <file.json>` — 스킬 자동 생성
- `npm run create-mercenary -- --config <file.json>` — 용병 자동 생성

### 문서 동기화
코드 변경 시 관련 문서 함께 업데이트:
- `Docs/스킬-목록.md` — 스킬 추가/수정 시
- `Docs/폴더-구조.md` — 파일 추가/삭제 시
- `Docs/전투-시스템-가이드.md` — 전투 로직 변경 시

### 파일 네이밍
- 스킬 ID: snake_case (`advanced_burn`)
- 스킬 파일명: kebab-case (`advanced-burn.ts`)
- 변수명: camelCase (`advancedBurn`)
- 용병 ID/파일명: 영문 소문자 (`carlson`)
