import type { BattleCharacter, BattleLogEntry } from '../types/game'
import { executeTurn, applyPassiveSkills } from './turn'

const MAX_ROUNDS = 100

/** 전투를 시뮬레이션하고 턴별 로그를 반환 */
export function simulateBattle(
  playerTeam: BattleCharacter[],
  enemyTeam: BattleCharacter[]
): BattleLogEntry[] {
  // 전투용 복사본 (statusEffects 독립 배열로 복사)
  const players = playerTeam.map((c) => ({ ...c, statusEffects: [...c.statusEffects] }))
  const enemies = enemyTeam.map((c) => ({ ...c, statusEffects: [...c.statusEffects] }))
  const logs: BattleLogEntry[] = []

  const alive = (team: BattleCharacter[]) => team.filter((c) => c.hp > 0)

  // 순서대로 정렬
  const sortedPlayers = [...players].sort((a, b) => a.order - b.order)
  const sortedEnemies = [...enemies].sort((a, b) => a.order - b.order)

  // passive 스킬 발동 (게임 시작 시 1회)
  const allSorted = [...sortedEnemies, ...sortedPlayers]
  applyPassiveSkills(allSorted, players, enemies, logs)

  for (let round = 1; round <= MAX_ROUNDS; round++) {
    // 라운드 시작 로그
    logs.push({ type: 'round_start', round, message: `라운드 ${round}` })

    // 번갈아 턴 진행: 상대1 → 나1 → 상대2 → 나2 → ...
    const maxLen = Math.max(sortedEnemies.length, sortedPlayers.length)

    for (let i = 0; i < maxLen; i++) {
      // 적 턴
      if (i < sortedEnemies.length) {
        const enemyChar = sortedEnemies[i]
        if (enemyChar.hp > 0) {
          executeTurn(enemyChar, enemies, players, logs)
        }
        if (alive(players).length === 0) break
      }

      // 내 턴
      if (i < sortedPlayers.length) {
        const playerChar = sortedPlayers[i]
        if (playerChar.hp > 0) {
          executeTurn(playerChar, players, enemies, logs)
        }
        if (alive(enemies).length === 0) break
      }
    }

    // 승패 체크
    if (alive(players).length === 0 || alive(enemies).length === 0) break
  }

  return logs
}
