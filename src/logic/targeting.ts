// 타겟팅 로직
// 명세: Docs/명세/전투/05-타겟팅.md

import { WELL512 } from './random'

export const COL_COUNT = 6  // 각 진영 열 수
export const ROW_COUNT = 3

// ─── 타입 ────────────────────────────────────────────────

export interface GridChar {
  gridIndex: number  // row * COL_COUNT + col
  key: string
  isDead: boolean
  hasTaunt: boolean         // subType 9, targetType 1
  hasFocusFire: boolean     // subType 9, targetType 2
  hasAggro: boolean         // subType 0x11
  hasChaos: boolean         // subType 0x0A (type=0)
  hasChaosBuff: boolean     // subType 0x1D (type=1) — 혼란 유도
  hasTargetExcept: boolean  // subType 0x3A — 타겟 제외
  // 타겟 변환 버프
  searchTypeOverride: number | null  // 0x12→1, 0x34→2, 0x1C→7, 0x1D→8
}

// ─── 그리드 좌표 헬퍼 ────────────────────────────────────

export function gridRow(idx: number): number {
  return Math.floor(idx / COL_COUNT)
}

export function gridCol(idx: number): number {
  return idx % COL_COUNT
}

// ─── 타겟 변환 체크 ──────────────────────────────────────

/** SearchTarget 진입 전 searchType 변환 버프 적용. 명세 §4.1 */
function checkSearchTypeTransform(owner: GridChar, searchType: number): number {
  if (owner.searchTypeOverride !== null) {
    return owner.searchTypeOverride
  }
  return searchType
}

// ─── searchType 구현 ─────────────────────────────────────

/**
 * SearchTypeSkip: 전방부터 skip개 건너뛰고 다음 생존자 선택.
 * skip=0 → 전방 첫 번째, skip=1 → 두 번째, skip=2 → 세 번째.
 * 명세 §2.3
 */
function searchTypeSkip(
  gridList: GridChar[],
  startGridId: number,
  skip: number
): number {
  const size = gridList.length
  const visited = new Set<number>()
  let gridId = startGridId

  while (true) {
    if (gridId >= size) break

    const found: number[] = []
    let col = gridId
    while (col < size) {
      const char = gridList[col]
      if (!char.isDead && !char.hasTargetExcept) {
        found.push(col)
      }
      col += COL_COUNT  // 다음 행, 같은 열 방향
    }

    if (found.length === skip + 1) return found[found.length - 1]
    if (found.length > 0) return found[found.length - 1]

    visited.add(gridId)
    gridId = gridId < COL_COUNT - 1 ? gridId + 1 : 0
    if (visited.has(gridId)) return -1
  }
  return -1
}

/**
 * SearchTypeLast: 최후방 생존자.
 * 명세 §2.4~2.5
 */
function searchTypeLast(gridList: GridChar[], startGridId: number): number {
  const size = gridList.length

  function searchInCol(colId: number): number {
    if (colId >= size) return -1
    let lastFound = -1
    let col = colId
    while (col < size) {
      const char = gridList[col]
      if (!char.isDead && !char.hasTargetExcept) {
        lastFound = col
      }
      col += COL_COUNT
    }
    return lastFound
  }

  let result = searchInCol(startGridId)
  if (result !== -1) return result

  for (let c = startGridId + 1; c < COL_COUNT; c++) {
    result = searchInCol(c)
    if (result !== -1) return result
  }

  for (let c = 0; c < COL_COUNT; c++) {
    result = searchInCol(c)
    if (result !== -1) return result
  }

  return -1
}

/**
 * SearchTypeRandom: 살아있는 캐릭터 중 랜덤.
 * 명세 §2.6
 */
function searchTypeRandom(gridList: GridChar[], rng: WELL512): number {
  const candidates = gridList
    .filter(c => !c.isDead && !c.hasTargetExcept)
    .map(c => c.gridIndex)

  if (candidates.length === 0) return -1
  return candidates[rng.getRandom(0, candidates.length)]
}

/**
 * SearchTarget: searchType별 단일 타겟 반환.
 * 명세 §2.1~2.7
 */
export function searchTarget(
  owner: GridChar,
  gridList: GridChar[],
  searchType: number,
  rng: WELL512
): number {
  const effective = checkSearchTypeTransform(owner, searchType)
  const ownerCol = gridCol(owner.gridIndex)

  switch (effective) {
    case 1: return searchTypeSkip(gridList, ownerCol, 0)
    case 2: return searchTypeLast(gridList, ownerCol)
    case 3: return searchTypeRandom(gridList, rng)
    case 4: return searchTypeSkip(gridList, ownerCol, 1)
    case 5: return searchTypeSkip(gridList, ownerCol, 0)  // next_ally 간소화
    case 7: return owner.gridIndex
    case 8: return searchTypeRandom(gridList, rng)
    case 9: return searchTypeSkip(gridList, ownerCol, 2)
    default: return searchTypeRandom(gridList, rng)
  }
}

// ─── 적 타겟 탐색 (SearchEnemyTarget) ────────────────────

/**
 * 6단계 우선순위 타겟팅.
 * 명세 §3.1~3.2
 */
export function searchEnemyTarget(
  owner: GridChar,
  enemyList: GridChar[],
  searchType: number,
  rng: WELL512
): number {
  // 1단계: 도발(taunt) + 집중공격(focus_fire) 스캔
  for (const char of enemyList) {
    if (char.isDead) continue
    if (char.hasTaunt) return char.gridIndex  // 최우선
  }

  // 2단계: 일반 searchType 탐색 전 집중공격 폴백
  let focusFireFallback = -1
  for (const char of enemyList) {
    if (char.isDead) continue
    if (char.hasFocusFire && focusFireFallback === -1) {
      focusFireFallback = char.gridIndex
    }
  }
  if (focusFireFallback !== -1) return focusFireFallback

  // 3단계: 광역 어그로 (SubType 0x11)
  for (const char of enemyList) {
    if (char.isDead) continue
    if (char.hasAggro) return char.gridIndex
  }

  // 4단계: 일반 searchType 폴백
  return searchTarget(owner, enemyList, searchType, rng)
}

// ─── 다중 타겟 범위 (SearchMultiTarget) ──────────────────

/**
 * rangeType별 추가 타겟 수집.
 * 명세 §5.3 14종 rangeType.
 */
export function searchMultiTarget(
  mainIdx: number,
  allChars: GridChar[],  // 전체 그리드 (적 진영)
  rangeType: number,
  rangeSize: number,
  includeDead = false
): number[] {
  const result = new Set<number>([mainIdx])
  const size = allChars.length

  function add(idx: number) {
    if (idx < 0 || idx >= size) return
    const char = allChars[idx]
    if (char && (includeDead || !char.isDead)) {
      result.add(idx)
    }
  }

  const mainRow = gridRow(mainIdx)
  const mainCol = gridCol(mainIdx)

  switch (rangeType) {
    case 1:
      // single — 메인 타겟만
      break

    case 2:
      // front_n — 아래 방향으로 rangeSize행
      for (let i = 1; i <= rangeSize; i++) {
        add(mainIdx + COL_COUNT * i)
      }
      break

    case 3:
      // cross — 상하좌우
      for (let i = 1; i <= rangeSize; i++) {
        add(mainIdx - COL_COUNT * i)  // 위
        add(mainIdx + COL_COUNT * i)  // 아래
      }
      for (let i = -rangeSize; i <= rangeSize; i++) {
        if (i === 0) continue
        const pos = mainIdx + i
        if (gridRow(pos) === mainRow && pos >= 0) add(pos)
      }
      break

    case 4:
      // area_n — NxN 정사각형
      for (let r = -rangeSize; r <= rangeSize; r++) {
        for (let c = -rangeSize; c <= rangeSize; c++) {
          const pos = mainIdx + r * COL_COUNT + c
          if (pos === mainIdx) continue
          if (pos < 0 || pos >= size) continue
          if (gridRow(pos) !== mainRow + r) continue  // 행 경계 체크
          add(pos)
        }
      }
      break

    case 5:
      // vertical — 같은 행 내 좌우
      for (let c = -rangeSize; c <= rangeSize; c++) {
        if (c === 0) continue
        const pos = mainIdx + c
        if (gridRow(pos) === mainRow && pos >= 0) add(pos)
      }
      break

    case 6:
      // diamond — 마름모형
      for (let r = -rangeSize; r <= rangeSize; r++) {
        const maxC = rangeSize - Math.abs(r)
        for (let c = -maxC; c <= maxC; c++) {
          const pos = mainIdx + r * COL_COUNT + c
          if (pos === mainIdx) continue
          if (pos < 0 || pos >= size) continue
          if (gridRow(pos) !== mainRow + r) continue
          add(pos)
        }
      }
      break

    case 7:
      // back_n — 위 방향으로 rangeSize행
      for (let i = 1; i <= rangeSize; i++) {
        add(mainIdx - COL_COUNT * i)
      }
      break

    case 8:
      // x_shape — 대각선 4방향
      for (let i = 1; i <= rangeSize; i++) {
        const bases = [mainIdx - i * COL_COUNT, mainIdx + i * COL_COUNT]
        for (const base of bases) {
          for (const pos of [base - i, base + i]) {
            if (pos < 0 || pos >= size) continue
            if (gridRow(pos) !== gridRow(base)) continue
            add(pos)
          }
        }
      }
      break

    case 9:
      // vertical_line — 같은 열(col) 상하
      for (let r = -rangeSize; r <= rangeSize; r++) {
        const pos = mainIdx + r * COL_COUNT
        if (pos === mainIdx) continue
        if (pos < 0 || pos >= size) continue
        if (gridCol(pos) !== mainCol) continue  // 열 유지
        add(pos)
      }
      break

    case 10:
      // small_cross — 상하좌우 1칸씩
      for (const delta of [-COL_COUNT, COL_COUNT]) {
        add(mainIdx + delta)
      }
      for (const delta of [-1, 1]) {
        const pos = mainIdx + delta
        if (gridRow(pos) === mainRow && pos >= 0) add(pos)
      }
      break

    case 11:
      // horizontal — 같은 열 내 전체 (세로 열 전체)
      for (let r = 0; r < ROW_COUNT; r++) {
        const pos = mainCol + r * COL_COUNT
        if (pos !== mainIdx) add(pos)
      }
      break

    case 12:
      // chaining — 단일 타겟 (체이닝은 battle.ts에서 처리)
      break

    case 13:
      // all — 전체 대상
      for (let i = 0; i < size; i++) {
        if (i !== mainIdx) add(i)
      }
      break

    case 14:
      // front_extend — 전방 확장
      for (let i = 1; i <= rangeSize; i++) {
        add(mainIdx + COL_COUNT * i)
      }
      // 같은 행 전방 확장
      for (let c = mainCol + 1; c < COL_COUNT; c++) {
        add(mainRow * COL_COUNT + c)
      }
      break
  }

  return Array.from(result)
}

// ─── 혼란 리스트 스왑 ────────────────────────────────────

/**
 * GetEnemyList: 혼란 상태면 아군 리스트 반환.
 * 명세 §1.1
 */
export function getEnemyList(
  owner: GridChar,
  ownerList: GridChar[],
  enemyList: GridChar[]
): GridChar[] {
  if (owner.hasChaos) return ownerList
  return enemyList
}

/**
 * GetOwnerList: 혼란 상태면 적 리스트 반환.
 * 명세 §1.2
 */
export function getOwnerList(
  owner: GridChar,
  ownerList: GridChar[],
  enemyList: GridChar[]
): GridChar[] {
  if (owner.hasChaos) return enemyList
  return ownerList
}
