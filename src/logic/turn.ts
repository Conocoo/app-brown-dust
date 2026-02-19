import type { BattleCharacter, BattleLogEntry } from '../types/game'
import type { Skill } from '../types/skill'
import { getSkillById } from '../data/skills'
import { findTarget, findNextAlly } from './targeting'
import { calculateDamage } from './damage'

/** 치명타/스침 판정 결과 */
interface CritGrazeResult {
  multiplier: number
  isCritical: boolean
  isGraze: boolean
}

/** 치명타(공격자) + 스침(방어자) 판정 */
function rollCritGraze(attacker: BattleCharacter, defender: BattleCharacter): CritGrazeResult {
  let multiplier = 1.0
  const isCritical = Math.random() * 100 < attacker.critRate
  const isGraze = Math.random() * 100 < defender.grazeRate

  if (isCritical) {
    multiplier *= 2.0 + attacker.critDamage / 100
  }
  if (isGraze) {
    multiplier *= 0.65
  }

  return { multiplier, isCritical, isGraze }
}

/** 한 캐릭터의 턴 실행 */
export function executeTurn(
  actor: BattleCharacter,
  allies: BattleCharacter[],
  enemies: BattleCharacter[],
  logs: BattleLogEntry[]
): void {
  const skills = actor.skillIds
    .map((id) => getSkillById(id))
    .filter((s): s is Skill => s !== undefined)

  // 1. before_attack 스킬 발동
  for (const skill of skills) {
    if (skill.timing === 'before_attack') {
      executeSkill(skill, actor, allies, enemies, logs)
    }
  }

  // 2. 일반공격 (공통 메커니즘)
  executeNormalAttack(actor, enemies, logs)

  // 3. after_attack 스킬 발동
  for (const skill of skills) {
    if (skill.timing === 'after_attack') {
      executeSkill(skill, actor, allies, enemies, logs)
    }
  }
}

/** 일반공격 실행 */
function executeNormalAttack(
  actor: BattleCharacter,
  enemies: BattleCharacter[],
  logs: BattleLogEntry[]
): void {
  const target = findTarget(actor, enemies)
  if (!target) return

  const actorLabel = `${actor.emoji} ${actor.name}`
  const baseDamage = calculateDamage(actor.atk, target.def)
  const { multiplier, isCritical, isGraze } = rollCritGraze(actor, target)
  const damage = Math.round(baseDamage * multiplier)
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
    isCritical,
    isGraze,
  })
}

/** 스킬 실행 */
function executeSkill(
  skill: Skill,
  actor: BattleCharacter,
  allies: BattleCharacter[],
  enemies: BattleCharacter[],
  logs: BattleLogEntry[]
): void {
  let target: BattleCharacter | null = null
  switch (skill.target) {
    case 'enemy_front':
      target = findTarget(actor, enemies)
      break
    case 'next_ally':
      target = findNextAlly(actor, allies)
      break
    case 'self':
      target = actor
      break
  }

  if (!target) return

  for (const effect of skill.effects) {
    applyEffect(effect, skill, actor, target, logs)
  }
}

/** 개별 효과 적용 */
function applyEffect(
  effect: { type: string; value: number },
  skill: Skill,
  actor: BattleCharacter,
  target: BattleCharacter,
  logs: BattleLogEntry[]
): void {
  const actorLabel = `${actor.emoji} ${actor.name}`
  const targetLabel = `${target.emoji} ${target.name}`

  switch (effect.type) {
    case 'damage': {
      const baseDamage = calculateDamage(actor.atk, target.def)
      const { multiplier, isCritical, isGraze } = rollCritGraze(actor, target)
      const damage = Math.round(baseDamage * effect.value * multiplier)
      target.hp = Math.max(0, target.hp - damage)
      logs.push({
        type: 'attack',
        attacker: actorLabel,
        attackerTeam: actor.team,
        defender: targetLabel,
        damage,
        defenderHpAfter: target.hp,
        defenderMaxHp: target.maxHp,
        defeated: target.hp <= 0,
        skillName: skill.name,
        isCritical,
        isGraze,
      })
      break
    }
    case 'heal': {
      const { multiplier, isCritical } = rollCritGraze(actor, target)
      const healAmount = Math.round(effect.value * multiplier)
      target.hp = Math.min(target.maxHp, target.hp + healAmount)
      logs.push({
        type: 'support',
        attackerTeam: actor.team,
        attacker: actorLabel,
        defender: targetLabel,
        skillName: skill.name,
        isCritical,
        message: `${actorLabel} → ${targetLabel}에게 ${healAmount} 회복!`,
      })
      break
    }
    case 'heal_percent': {
      const { multiplier, isCritical } = rollCritGraze(actor, target)
      const healAmount = Math.round(target.maxHp * effect.value / 100 * multiplier)
      target.hp = Math.min(target.maxHp, target.hp + healAmount)
      logs.push({
        type: 'support',
        attackerTeam: actor.team,
        attacker: actorLabel,
        defender: targetLabel,
        skillName: skill.name,
        isCritical,
        message: `${actorLabel} → ${targetLabel}에게 ${healAmount} 회복 (${effect.value}%)!`,
      })
      break
    }
    default: {
      logs.push({
        type: 'support',
        attackerTeam: actor.team,
        skillName: skill.name,
        message: `${actorLabel} → ${targetLabel}에게 ${skill.name}!`,
      })
      break
    }
  }
}

/** passive 스킬 일괄 발동 (게임 시작 시) */
export function applyPassiveSkills(
  allCharacters: BattleCharacter[],
  allies: BattleCharacter[],
  enemies: BattleCharacter[],
  logs: BattleLogEntry[]
): void {
  for (const actor of allCharacters) {
    if (actor.hp <= 0) continue
    const skills = actor.skillIds
      .map((id) => getSkillById(id))
      .filter((s): s is Skill => s !== undefined)

    for (const skill of skills) {
      if (skill.timing === 'passive') {
        const isPlayer = actor.team === 'player'
        executeSkill(skill, actor, isPlayer ? allies : enemies, isPlayer ? enemies : allies, logs)
      }
    }
  }
}
