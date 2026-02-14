import type { BattleCharacter, BattleLogEntry } from '../types/game'

const ROWS = 3
const MAX_ROUNDS = 100

/** 행 기반 타겟 찾기: 같은 행 → 아래 행 → 위 행 (순환) */
function findTarget(
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
function findNextAlly(
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

/** 전투를 시뮬레이션하고 턴별 로그를 반환 */
export function simulateBattle(
  playerTeam: BattleCharacter[],
  enemyTeam: BattleCharacter[]
): BattleLogEntry[] {
  // 전투용 복사본
  const players = playerTeam.map((c) => ({ ...c }))
  const enemies = enemyTeam.map((c) => ({ ...c }))
  const logs: BattleLogEntry[] = []

  const alive = (team: BattleCharacter[]) => team.filter((c) => c.hp > 0)

  // 순서대로 정렬
  const sortedPlayers = [...players].sort((a, b) => a.order - b.order)
  const sortedEnemies = [...enemies].sort((a, b) => a.order - b.order)

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

/** 한 캐릭터의 턴 실행 */
function executeTurn(
  actor: BattleCharacter,
  allies: BattleCharacter[],
  enemies: BattleCharacter[],
  logs: BattleLogEntry[]
): void {
  const actorLabel = `${actor.emoji} ${actor.name}`

  switch (actor.type) {
    case 'attacker':
    case 'defender': {
      // 일반 공격
      const target = findTarget(actor, enemies)
      if (!target) return
      const damage = Math.max(1, actor.atk - target.def)
      target.hp = Math.max(0, target.hp - damage)
      logs.push({
        type: 'attack',
        attacker: actorLabel,
        attackerTeam: actor.team,
        defender: `${target.emoji} ${target.name}`,
        damage,
        defenderHpAfter: target.hp,
        defenderMaxHp: target.maxHp,
        defeated: target.hp <= 0,
      })
      break
    }

    case 'mage': {
      if (!actor.isCasting) {
        // 캐스팅 시작
        actor.isCasting = true
        logs.push({
          type: 'casting',
          attackerTeam: actor.team,
          message: `${actorLabel} 마법 캐스팅 중...`,
        })
        // 캐스팅 후 다음 아군에게 턴 넘김 (= 이 턴은 끝)
      } else {
        // 캐스팅 완료 → 공격
        const target = findTarget(actor, enemies)
        if (!target) return
        const damage = Math.max(1, actor.atk - target.def)
        target.hp = Math.max(0, target.hp - damage)
        actor.isCasting = false
        logs.push({
          type: 'attack',
          attacker: actorLabel,
          attackerTeam: actor.team,
          defender: `${target.emoji} ${target.name}`,
          damage,
          defenderHpAfter: target.hp,
          defenderMaxHp: target.maxHp,
          defeated: target.hp <= 0,
        })
      }
      break
    }

    case 'support': {
      // 다음 순서 아군에게 버프 (placeholder)
      const nextAlly = findNextAlly(actor, allies)
      if (nextAlly) {
        logs.push({
          type: 'support',
          attackerTeam: actor.team,
          message: `${actorLabel} → ${nextAlly.emoji} ${nextAlly.name}에게 지원!`,
        })
        // TODO: 실제 버프 효과 구현 (미정)
      } else {
        logs.push({
          type: 'support',
          attackerTeam: actor.team,
          message: `${actorLabel} 지원 대상 없음`,
        })
      }
      break
    }
  }
}
