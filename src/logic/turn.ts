import type { BattleCharacter, BattleLogEntry, StatusEffect } from '../types/game'
import type { Skill, SkillEffect } from '../types/skill'
import { getSkillById } from '../data/skills'
import { findNextAlly, resolveEnemyTarget, getTargetsInRange } from './targeting'
import { calculateFullDamage, getEffectiveCritRate } from './damage'

// ─── 유틸 ───

let effectIdCounter = 0

function nextEffectId(): string {
  return `eff_${++effectIdCounter}`
}

function charLabel(c: BattleCharacter): string {
  return `${c.emoji} ${c.name}`
}

/** 치명타/스침 판정 */
interface CritGrazeResult {
  multiplier: number
  isCritical: boolean
  isGraze: boolean
}

function rollCritGraze(attacker: BattleCharacter, defender: BattleCharacter): CritGrazeResult {
  let multiplier = 1.0
  const critRate = getEffectiveCritRate(attacker)
  const isCritical = Math.random() * 100 < critRate
  const isGraze = Math.random() * 100 < defender.agility

  if (isCritical) {
    multiplier *= 2.0 + attacker.critDamage / 100
  }
  if (isGraze) {
    multiplier *= 0.65
  }

  return { multiplier, isCritical, isGraze }
}

// ─── CC 판정 ───

/** 행동 불가 CC (기절/빙결/감전) */
function isStunned(char: BattleCharacter): boolean {
  return char.statusEffects.some(
    (e) => e.type === 'stun' || e.type === 'freeze' || e.type === 'shock'
  )
}

/** 침묵 (스킬 발동 불가) */
function isSilenced(char: BattleCharacter): boolean {
  return char.statusEffects.some((e) => e.type === 'silence')
}

/** 현혹 (아군 공격) */
function isCharmed(char: BattleCharacter): boolean {
  return char.statusEffects.some((e) => e.type === 'charm')
}

// ─── 면역 판정 ───

/** 면역 체크: true면 효과 차단됨 */
function checkImmunity(
  target: BattleCharacter,
  effect: SkillEffect,
  logs: BattleLogEntry[]
): boolean {
  const effects = target.statusEffects

  // all_immune: 버프/디버프 모두 차단
  if (effects.some((e) => e.type === 'all_immune')) {
    logs.push({ type: 'immune', message: `${charLabel(target)} → 모든효과 면역!` })
    return true
  }

  // 버프는 all_immune 외에는 차단 안됨
  if (!effect.debuffClass) return false

  // ignoreImmunity면 면역 관통
  if (effect.ignoreImmunity) return false

  // harmful_immune: 모든 디버프 차단
  if (effects.some((e) => e.type === 'harmful_immune')) {
    logs.push({ type: 'immune', message: `${charLabel(target)} → 해로운효과 면역!` })
    return true
  }

  // 세부 면역
  const immuneMap: Record<string, string> = {
    cc: 'cc_immune',
    dot: 'dot_immune',
    stat_weaken: 'stat_debuff_immune',
  }
  const immuneType = immuneMap[effect.debuffClass]
  if (immuneType && effects.some((e) => e.type === immuneType)) {
    logs.push({ type: 'immune', message: `${charLabel(target)} → 면역!` })
    return true
  }

  return false
}

// ─── 상태 효과 부여 ───

function applyStatusEffect(
  target: BattleCharacter,
  effect: SkillEffect,
  actor: BattleCharacter,
  logs: BattleLogEntry[],
  skillName: string
): void {
  if (!effect.duration) return

  const isBuff = !effect.debuffClass
  const category = isBuff ? 'buff' : 'debuff' as const

  // 면역 판정
  if (checkImmunity(target, effect, logs)) return

  // 민첩에 의한 디버프 턴수 감소 (50%)
  let duration = effect.duration
  if (category === 'debuff' && target.agility > 0) {
    duration = Math.max(1, Math.round(duration * 0.5))
  }

  const se: StatusEffect = {
    id: nextEffectId(),
    type: effect.type,
    value: effect.value,
    remainingTurns: duration,
    category,
    buffType: isBuff ? effect.buffType : undefined,
    debuffClass: !isBuff ? effect.debuffClass : undefined,
    ignoreImmunity: effect.ignoreImmunity,
  }

  target.statusEffects.push(se)

  const logType = isBuff ? 'buff' : 'debuff' as const
  logs.push({
    type: logType,
    attackerTeam: actor.team,
    attacker: charLabel(actor),
    defender: charLabel(target),
    skillName,
    message: `${charLabel(actor)} → ${charLabel(target)}에게 ${skillName} (${effect.type}, ${duration}턴)`,
    targetKey: `${target.team}-${target.templateId}`,
    targetStatusEffects: [...target.statusEffects],
  })
}

// ─── 턴 시작 처리 ───

function processTurnStart(
  actor: BattleCharacter,
  logs: BattleLogEntry[]
): void {
  const toRemove: string[] = []

  for (const effect of actor.statusEffects) {
    // 지속 피해 (DoT)
    if (effect.type === 'burn' || effect.type === 'bleed' || effect.type === 'poison') {
      actor.hp = Math.max(0, actor.hp - effect.value)
      logs.push({
        type: 'debuff',
        defender: charLabel(actor),
        damage: effect.value,
        defenderHpAfter: actor.hp,
        defenderMaxHp: actor.maxHp,
        defeated: actor.hp <= 0,
        message: `${charLabel(actor)} → ${effect.type}으로 ${effect.value} 피해! (HP: ${actor.hp})`,
      })
    }

    // 재생 (regen)
    if (effect.type === 'regen') {
      const healAmount = effect.value
      actor.hp = Math.min(actor.maxHp, actor.hp + healAmount)
      logs.push({
        type: 'buff',
        defender: charLabel(actor),
        message: `${charLabel(actor)} → 재생으로 ${healAmount} 회복! (HP: ${actor.hp})`,
      })
    }

    // 턴 수 감소
    if (effect.remainingTurns > 0) {
      effect.remainingTurns--
      if (effect.remainingTurns <= 0) {
        toRemove.push(effect.id)
      }
    }
  }

  // 만료된 효과 제거
  actor.statusEffects = actor.statusEffects.filter((e) => !toRemove.includes(e.id))
}

// ─── 무효화 / 정화 ───

/** 무효화: 적 버프 제거 (갯수 제한 없음) */
function applyDispel(
  target: BattleCharacter,
  isEnhanced: boolean,
  actor: BattleCharacter,
  logs: BattleLogEntry[],
  skillName: string
): void {
  const before = target.statusEffects.length
  target.statusEffects = target.statusEffects.filter((e) => {
    if (e.category !== 'buff') return true
    // 강화무효화는 특별 버프 제거 불가
    if (isEnhanced && e.buffType === 'special') return true
    // 면역 버프는 무효화로도 제거 불가
    if (e.type.endsWith('_immune')) return true
    return false
  })
  const removed = before - target.statusEffects.length
  if (removed > 0) {
    logs.push({
      type: 'support',
      attackerTeam: actor.team,
      attacker: charLabel(actor),
      defender: charLabel(target),
      skillName,
      message: `${charLabel(actor)} → ${charLabel(target)}의 버프 ${removed}개 제거!`,
      targetKey: `${target.team}-${target.templateId}`,
      targetStatusEffects: [...target.statusEffects],
    })
  }
}

/** 정화: 아군 디버프 제거 (갯수 제한 없음) */
function applyCleanse(
  target: BattleCharacter,
  actor: BattleCharacter,
  logs: BattleLogEntry[],
  skillName: string
): void {
  const before = target.statusEffects.length
  target.statusEffects = target.statusEffects.filter((e) => e.category !== 'debuff')
  const removed = before - target.statusEffects.length
  if (removed > 0) {
    logs.push({
      type: 'support',
      attackerTeam: actor.team,
      attacker: charLabel(actor),
      defender: charLabel(target),
      skillName,
      message: `${charLabel(actor)} → ${charLabel(target)}의 디버프 ${removed}개 제거!`,
      targetKey: `${target.team}-${target.templateId}`,
      targetStatusEffects: [...target.statusEffects],
    })
  }
}

// ─── 반사반격 ───

function processCounterAttack(
  attacker: BattleCharacter,
  defender: BattleCharacter,
  damageDealt: number,
  logs: BattleLogEntry[]
): void {
  // 데미지 반격
  const counterDmg = defender.statusEffects.find((e) => e.type === 'counter_damage')
  if (counterDmg) {
    const counterDamage = Math.round(damageDealt * counterDmg.value / 100)
    attacker.hp = Math.max(0, attacker.hp - counterDamage)
    logs.push({
      type: 'reflect',
      attacker: charLabel(defender),
      attackerTeam: defender.team,
      defender: charLabel(attacker),
      damage: counterDamage,
      defenderHpAfter: attacker.hp,
      defenderMaxHp: attacker.maxHp,
      defeated: attacker.hp <= 0,
      message: `${charLabel(defender)} → ${charLabel(attacker)}에게 ${counterDamage} 반격!`,
    })
  }

  // 디버프 반격 (강화 버프 제거)
  const counterDebuff = defender.statusEffects.find((e) => e.type === 'counter_debuff')
  if (counterDebuff) {
    applyDispel(attacker, true, defender, logs, '저주반격')
  }

  // 디버프 반사 (무지개 반사)
  if (defender.statusEffects.some((e) => e.type === 'reflect_debuff')) {
    logs.push({
      type: 'reflect',
      attacker: charLabel(defender),
      attackerTeam: defender.team,
      message: `${charLabel(defender)} → 디버프 반사 발동!`,
    })
  }
}

// ─── 스킬 실행 ───

/** 스킬의 메인 타겟 결정 (enemy 계열은 용병의 attackTarget 사용) */
function findSkillTarget(
  skill: Skill,
  actor: BattleCharacter,
  allies: BattleCharacter[],
  enemies: BattleCharacter[]
): BattleCharacter | null {
  if (skill.target === 'next_ally') return findNextAlly(actor, allies)
  if (skill.target === 'self') return actor
  // enemy 계열: 용병의 attackTarget으로 타겟 선택
  return resolveEnemyTarget(actor, enemies)
}

/** 스킬 대상이 적인지 판별 */
function isEnemyTargetSkill(skill: Skill): boolean {
  return skill.target !== 'next_ally' && skill.target !== 'self'
}

/** 개별 효과 적용 */
function applyEffect(
  effect: SkillEffect,
  skill: Skill,
  actor: BattleCharacter,
  target: BattleCharacter,
  logs: BattleLogEntry[]
): void {
  const actorLabel = charLabel(actor)
  const targetLabel = charLabel(target)

  // 즉시 효과
  switch (effect.type) {
    case 'damage': {
      const { multiplier, isCritical, isGraze } = rollCritGraze(actor, target)
      const damage = calculateFullDamage(actor, target, effect.value, multiplier)
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
      return
    }
    case 'heal': {
      const { multiplier, isCritical } = rollCritGraze(actor, target)
      const curseEffect = target.statusEffects.find((e) => e.type === 'curse')
      const curseReduction = curseEffect ? (1 - curseEffect.value / 100) : 1
      const healAmount = Math.round(effect.value * multiplier * curseReduction)
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
      return
    }
    case 'heal_percent': {
      const { multiplier, isCritical } = rollCritGraze(actor, target)
      const curseEffect = target.statusEffects.find((e) => e.type === 'curse')
      const curseReduction = curseEffect ? (1 - curseEffect.value / 100) : 1
      const healAmount = Math.round(target.maxHp * effect.value / 100 * multiplier * curseReduction)
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
      return
    }
    case 'dispel': {
      applyDispel(target, false, actor, logs, skill.name)
      return
    }
    case 'dispel_enhance': {
      applyDispel(target, true, actor, logs, skill.name)
      return
    }
    case 'cleanse': {
      applyCleanse(target, actor, logs, skill.name)
      return
    }
  }

  // 지속 효과 → 상태 효과 부여
  if (effect.duration) {
    applyStatusEffect(target, effect, actor, logs, skill.name)
    return
  }

  // 기타
  logs.push({
    type: 'support',
    attackerTeam: actor.team,
    skillName: skill.name,
    message: `${actorLabel} → ${targetLabel}에게 ${skill.name}!`,
  })
}

function executeSkill(
  skill: Skill,
  actor: BattleCharacter,
  allies: BattleCharacter[],
  enemies: BattleCharacter[],
  logs: BattleLogEntry[]
): void {
  const mainTarget = findSkillTarget(skill, actor, allies, enemies)
  if (!mainTarget) return

  // 적 대상 스킬: 용병의 공격 범위 적용 (다중 타겟 순차 처리)
  if (isEnemyTargetSkill(skill)) {
    const targets = getTargetsInRange(mainTarget, actor.attackRange, actor.rangeSize, enemies, actor)
    for (const target of targets) {
      if (target.hp <= 0) continue
      for (const effect of skill.effects) {
        applyEffect(effect, skill, actor, target, logs)
      }
    }
  } else {
    // 아군/자기 대상: 단일 타겟
    for (const effect of skill.effects) {
      applyEffect(effect, skill, actor, mainTarget, logs)
    }
  }
}

/** 스킬이 이로운 효과인지 판단 (before_attack 정렬용) */
function isBeneficialSkill(skill: Skill): boolean {
  return skill.effects.every((e) => {
    if (e.debuffClass) return false
    if (e.type === 'damage' || e.type === 'dispel' || e.type === 'dispel_enhance') return false
    if (isEnemyTargetSkill(skill)) return false
    return true
  })
}

// ─── 일반공격 ───

function executeNormalAttack(
  actor: BattleCharacter,
  allies: BattleCharacter[],
  enemies: BattleCharacter[],
  logs: BattleLogEntry[]
): void {
  // 현혹: 아군을 공격 (범위 무시, 단일 타겟)
  if (isCharmed(actor)) {
    const aliveAllies = allies.filter((a) => a !== actor && a.hp > 0)
    const target = aliveAllies.length > 0 ? aliveAllies[0] : null
    if (!target) return
    attackSingleTarget(actor, target, logs, false)
    return
  }

  // 용병의 attackTarget으로 메인 타겟 선택
  const mainTarget = resolveEnemyTarget(actor, enemies)
  if (!mainTarget) return

  // 용병의 attackRange로 범위 내 대상 목록
  const targets = getTargetsInRange(mainTarget, actor.attackRange, actor.rangeSize, enemies, actor)

  // 대상별 순차 처리 (개별 치명/스침 판정)
  for (const target of targets) {
    if (target.hp <= 0) continue
    attackSingleTarget(actor, target, logs, true)
    if (actor.hp <= 0) break // 반격으로 사망 시 중단
  }
}

/** 단일 대상에 일반공격 실행 (치명/스침 개별 판정) */
function attackSingleTarget(
  actor: BattleCharacter,
  target: BattleCharacter,
  logs: BattleLogEntry[],
  allowCounter: boolean
): void {
  const { multiplier, isCritical, isGraze } = rollCritGraze(actor, target)
  const damage = calculateFullDamage(actor, target, 1.0, multiplier)
  target.hp = Math.max(0, target.hp - damage)

  logs.push({
    type: 'attack',
    attacker: charLabel(actor),
    attackerTeam: actor.team,
    defender: charLabel(target),
    damage,
    defenderHpAfter: target.hp,
    defenderMaxHp: target.maxHp,
    defeated: target.hp <= 0,
    isCritical,
    isGraze,
  })

  // 흡혈
  const lifesteal = actor.statusEffects.find((e) => e.type === 'lifesteal')
  if (lifesteal) {
    const healAmount = Math.round(damage * lifesteal.value / 100)
    actor.hp = Math.min(actor.maxHp, actor.hp + healAmount)
    logs.push({
      type: 'buff',
      attacker: charLabel(actor),
      attackerTeam: actor.team,
      message: `${charLabel(actor)} → 흡혈로 ${healAmount} 회복!`,
    })
  }

  // 반사반격 (반격 디버프는 이후 대상 공격에도 누적 적용)
  if (allowCounter && target.hp > 0) {
    processCounterAttack(actor, target, damage, logs)
  }
}

// ─── 메인 턴 실행 ───

/** 한 캐릭터의 턴 실행 */
export function executeTurn(
  actor: BattleCharacter,
  allies: BattleCharacter[],
  enemies: BattleCharacter[],
  logs: BattleLogEntry[]
): void {
  // 1. 턴 시작: 지속 효과 처리
  processTurnStart(actor, logs)
  logs.push({
    type: 'status_update',
    targetKey: `${actor.team}-${actor.templateId}`,
    targetStatusEffects: [...actor.statusEffects],
  })
  if (actor.hp <= 0) return

  // 2. CC 체크: 기절/빙결/감전이면 턴 스킵
  if (isStunned(actor)) {
    logs.push({
      type: 'debuff',
      defender: charLabel(actor),
      message: `${charLabel(actor)} → 행동 불가!`,
    })
    return
  }

  const skills = actor.skillIds
    .map((id) => getSkillById(id))
    .filter((s): s is Skill => s !== undefined)

  const canUseSkills = !isSilenced(actor) && !isCharmed(actor)

  // 3. before_attack 스킬 (이로운 → 해로운 순서)
  if (canUseSkills) {
    const beforeSkills = skills.filter((s) => s.timing === 'before_attack')
    const beneficial = beforeSkills.filter((s) => isBeneficialSkill(s))
    const harmful = beforeSkills.filter((s) => !isBeneficialSkill(s))

    for (const skill of [...beneficial, ...harmful]) {
      executeSkill(skill, actor, allies, enemies, logs)
    }
  }

  // 4. 일반공격
  executeNormalAttack(actor, allies, enemies, logs)

  // 5. after_attack 스킬
  if (canUseSkills) {
    for (const skill of skills) {
      if (skill.timing === 'after_attack') {
        executeSkill(skill, actor, allies, enemies, logs)
      }
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
