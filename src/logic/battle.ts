import type { BattleCharacter, BattleLogEntry } from '../types/game'
import { executeTurn, applyPassiveSkills, processPostDeathBuffs } from './turn'

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

  const alive = (team: BattleCharacter[]) =>
    team.filter((c) => c.hp > 0 && c.type !== 'support')

  // 순서대로 정렬
  const sortedPlayers = [...players].sort((a, b) => a.order - b.order)
  const sortedEnemies = [...enemies].sort((a, b) => a.order - b.order)

  // passive 스킬 발동 (게임 시작 시 1회)
  const allSorted = [...sortedEnemies, ...sortedPlayers]
  applyPassiveSkills(allSorted, players, enemies, logs)

  // 사후 버프 추적: 캐릭터별 on_death_buff 정보를 미리 저장
  const deathBuffMap = new Map<BattleCharacter, { type: string; linkedBuffId?: string }[]>()
  for (const char of [...players, ...enemies]) {
    const deathBuffs = char.statusEffects.filter(
      (e) => e.type === 'on_death_buff_allies' || e.type === 'on_death_buff_enemies'
    )
    if (deathBuffs.length > 0) {
      deathBuffMap.set(char, deathBuffs.map((e) => ({ type: e.type, linkedBuffId: e.linkedBuffId })))
    }
  }

  // 이미 처리된 사망 캐릭터 추적
  const processedDeaths = new Set<BattleCharacter>()

  /** 턴 후 새로 사망한 캐릭터의 사후 버프 처리 */
  function handleNewDeaths(): void {
    const allChars = [...players, ...enemies]
    for (const char of allChars) {
      if (char.hp > 0 || processedDeaths.has(char)) continue
      processedDeaths.add(char)

      const deathBuffs = deathBuffMap.get(char)
      if (!deathBuffs || deathBuffs.length === 0) continue

      const charAllies = char.team === 'player' ? players : enemies
      const charEnemies = char.team === 'player' ? enemies : players
      processPostDeathBuffs(char, charAllies, charEnemies, logs, deathBuffs)
    }
  }

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
          handleNewDeaths()
        }
        if (alive(players).length === 0) break
      }

      // 내 턴
      if (i < sortedPlayers.length) {
        const playerChar = sortedPlayers[i]
        if (playerChar.hp > 0) {
          executeTurn(playerChar, players, enemies, logs)
          handleNewDeaths()
        }
        if (alive(enemies).length === 0) break
      }
    }

    // 승패 체크
    if (alive(players).length === 0 || alive(enemies).length === 0) break
  }

  return logs
}
