import type { BattleCharacter, AttackRange } from '../types/game'

const ROWS = 3

// ─── 행 탐색 공통: 같은 행 → 아래 → 위 순환 ───

function getRowOrder(attackerRow: number): number[] {
  const rows: number[] = []
  for (let offset = 0; offset < ROWS; offset++) {
    rows.push((attackerRow + offset) % ROWS)
  }
  return rows
}

/** 행 내 적을 앞→뒤 순서로 정렬 */
function sortFrontToBack(enemies: BattleCharacter[], attackerTeam: 'player' | 'enemy'): BattleCharacter[] {
  return [...enemies].sort((a, b) => {
    if (attackerTeam === 'player') return a.col - b.col
    return b.col - a.col
  })
}

// ─── 타겟 선택 함수 ───

/** 같은 행 → 아래 → 위, 가장 앞 적 */
export function findTarget(
  attacker: BattleCharacter,
  enemies: BattleCharacter[]
): BattleCharacter | null {
  const alive = enemies.filter((e) => e.hp > 0)
  if (alive.length === 0) return null

  for (const row of getRowOrder(attacker.row)) {
    const inRow = sortFrontToBack(
      alive.filter((e) => e.row === row),
      attacker.team
    )
    if (inRow.length > 0) return inRow[0]
  }

  return alive[0]
}

/** 맨앞 건너뛰고 2번째 적 (1명뿐이면 그 적을 공격) */
export function findTargetSecond(
  attacker: BattleCharacter,
  enemies: BattleCharacter[]
): BattleCharacter | null {
  const alive = enemies.filter((e) => e.hp > 0)
  if (alive.length === 0) return null

  for (const row of getRowOrder(attacker.row)) {
    const inRow = sortFrontToBack(
      alive.filter((e) => e.row === row),
      attacker.team
    )
    if (inRow.length >= 2) return inRow[1]
    if (inRow.length === 1) return inRow[0]
  }

  return alive[0]
}

/** 같은 행 → 아래 → 위, 가장 뒤 적 */
export function findTargetBack(
  attacker: BattleCharacter,
  enemies: BattleCharacter[]
): BattleCharacter | null {
  const alive = enemies.filter((e) => e.hp > 0)
  if (alive.length === 0) return null

  for (const row of getRowOrder(attacker.row)) {
    const inRow = sortFrontToBack(
      alive.filter((e) => e.row === row),
      attacker.team
    )
    if (inRow.length > 0) return inRow[inRow.length - 1]
  }

  return alive[0]
}

/** 살아있는 적 중 랜덤 */
export function findTargetRandom(
  _attacker: BattleCharacter,
  enemies: BattleCharacter[]
): BattleCharacter | null {
  const alive = enemies.filter((e) => e.hp > 0)
  if (alive.length === 0) return null
  return alive[Math.floor(Math.random() * alive.length)]
}

/** attackTarget에 따라 적 타겟 선택 */
export function resolveEnemyTarget(
  attacker: BattleCharacter,
  enemies: BattleCharacter[]
): BattleCharacter | null {
  const alive = enemies.filter((e) => e.hp > 0)
  if (alive.length === 0) return null

  // 일점사: focus_fire 상태의 적이 있으면 최우선 타겟
  const focusTarget = alive.find((e) => e.statusEffects.some((s) => s.type === 'focus_fire'))
  if (focusTarget) return focusTarget

  switch (attacker.attackTarget) {
    case 'enemy_second':
      return findTargetSecond(attacker, enemies)
    case 'enemy_back':
      return findTargetBack(attacker, enemies)
    case 'enemy_random':
      return findTargetRandom(attacker, enemies)
    case 'enemy_front':
    default:
      return findTarget(attacker, enemies)
  }
}

/** 다음 순서의 아군 찾기 (지원형 버프 대상) */
export function findNextAlly(
  current: BattleCharacter,
  allies: BattleCharacter[]
): BattleCharacter | null {
  const aliveAllies = allies.filter((a) => a.hp > 0 && a !== current)
  if (aliveAllies.length === 0) return null

  const after = aliveAllies
    .filter((a) => a.order > current.order)
    .sort((a, b) => a.order - b.order)
  if (after.length > 0) return after[0]

  return aliveAllies.sort((a, b) => a.order - b.order)[0]
}

// ─── 범위 대상 목록 ───

/** 범위 내 대상 목록 반환 (메인 타겟 포함, 처리 순서대로) */
export function getTargetsInRange(
  mainTarget: BattleCharacter,
  attackRange: AttackRange,
  rangeSize: number | undefined,
  allEnemies: BattleCharacter[],
  attacker: BattleCharacter
): BattleCharacter[] {
  if (attackRange === 'single') return [mainTarget]

  const alive = allEnemies.filter((e) => e.hp > 0)
  const size = rangeSize ?? 1

  // 앞 = 공격자 쪽 방향, 뒤 = 공격자 반대 방향
  const frontDir = attacker.team === 'player' ? -1 : 1
  const backDir = -frontDir

  // 오프셋 [rowOffset, colOffset] 목록 (처리 순서대로)
  const offsets: [number, number][] = []

  switch (attackRange) {
    case 'horizontal':
      for (let i = 1; i <= size; i++) {
        offsets.push([0, frontDir * i])
        offsets.push([0, backDir * i])
      }
      break

    case 'vertical':
      for (let i = 1; i <= size; i++) {
        offsets.push([-i, 0])
        offsets.push([i, 0])
      }
      break

    case 'back_n':
      for (let i = 1; i <= size; i++) {
        offsets.push([0, backDir * i])
      }
      break

    case 'front_n':
      for (let i = 1; i <= size; i++) {
        offsets.push([0, frontDir * i])
      }
      break

    case 'cross':
      // 앞뒤 1칸 + 위아래 size칸
      offsets.push([0, frontDir])
      offsets.push([0, backDir])
      for (let i = 1; i <= size; i++) {
        offsets.push([-i, 0])
        offsets.push([i, 0])
      }
      break

    case 'x_shape':
      offsets.push([-1, frontDir])
      offsets.push([-1, backDir])
      offsets.push([1, frontDir])
      offsets.push([1, backDir])
      break

    case 'area_n': {
      const half = Math.floor(size / 2)
      for (let r = -half; r <= half; r++) {
        for (let c = -half; c <= half; c++) {
          if (r === 0 && c === 0) continue
          offsets.push([r, c])
        }
      }
      break
    }

    case 'diamond': {
      const radius = 2
      for (let r = -radius; r <= radius; r++) {
        for (let c = -radius; c <= radius; c++) {
          if (r === 0 && c === 0) continue
          if (Math.abs(r) + Math.abs(c) <= radius) {
            offsets.push([r, c])
          }
        }
      }
      break
    }
  }

  // 오프셋 → 실제 대상 변환 (중복 제거)
  const targetRow = mainTarget.row
  const targetCol = mainTarget.col
  const rangeTargets: BattleCharacter[] = []

  for (const [dr, dc] of offsets) {
    const r = targetRow + dr
    const c = targetCol + dc
    const found = alive.find((e) => e.row === r && e.col === c && e !== mainTarget)
    if (found && !rangeTargets.includes(found)) {
      rangeTargets.push(found)
    }
  }

  return [mainTarget, ...rangeTargets]
}
