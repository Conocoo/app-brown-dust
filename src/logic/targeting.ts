import type { BattleCharacter } from '../types/game'

const ROWS = 3

/** 행 기반 타겟 찾기: 같은 행 → 아래 행 → 위 행 (순환) */
export function findTarget(
  attacker: BattleCharacter,
  enemies: BattleCharacter[]
): BattleCharacter | null {
  const alive = enemies.filter((e) => e.hp > 0)
  if (alive.length === 0) return null

  // 행 검색 순서: 같은 행 → 아래로 순환
  for (let offset = 0; offset < ROWS; offset++) {
    const targetRow = (attacker.row + offset) % ROWS
    // 같은 행에서 가장 앞(col이 작은) 적 찾기
    const inRow = alive
      .filter((e) => e.row === targetRow)
      .sort((a, b) => {
        // 플레이어가 공격할 때: 적 영역에서 col이 작은(앞쪽) 적
        // 적이 공격할 때: 플레이어 영역에서 col이 큰(앞쪽, 적에 가까운) 적
        if (attacker.team === 'player') return a.col - b.col
        return b.col - a.col
      })
    if (inRow.length > 0) return inRow[0]
  }

  return alive[0] // fallback
}

/** 다음 순서의 아군 찾기 (지원형 버프 대상) */
export function findNextAlly(
  current: BattleCharacter,
  allies: BattleCharacter[]
): BattleCharacter | null {
  const aliveAllies = allies.filter((a) => a.hp > 0 && a !== current)
  if (aliveAllies.length === 0) return null

  // 현재 캐릭터보다 order가 큰 것 중 가장 작은 것
  const after = aliveAllies
    .filter((a) => a.order > current.order)
    .sort((a, b) => a.order - b.order)
  if (after.length > 0) return after[0]

  // 없으면 order가 가장 작은 아군 (순환)
  return aliveAllies.sort((a, b) => a.order - b.order)[0]
}
