import type { BattleCharacter, BattleLogEntry, StatusEffect } from '../types/game'
import type { Skill, SkillEffect } from '../types/skill'
import { findNextAlly, resolveEnemyTarget, getTargetsInRange } from './targeting'
import { calculateFullDamage, getEffectiveCritRate, getEffectiveCritDamage, getEffectiveAgility, getEffectiveAtk, getEffectiveDef, calcShieldReduction, getDmgTakenMultiplier } from './damage'
import { getSkillById } from '../data/skills'

// ─── 유틸 ───

let effectIdCounter = 0

function nextEffectId(): string {
  return `eff_${++effectIdCounter}`
}

function charLabel(c: BattleCharacter): string {
  return `${c.emoji} ${c.name}`
}

/** 연동 버프 제거: 상태효과 제거 시 linkedBuffId가 있으면 함께 제거 */
function removeStatusWithLinked(target: BattleCharacter, effectType: string): void {
  const effect = target.statusEffects.find((e) => e.type === effectType)
  if (!effect) return
  const linkedType = effect.linkedBuffId
  target.statusEffects = target.statusEffects.filter((e) => e.type !== effectType)
  if (linkedType) {
    target.statusEffects = target.statusEffects.filter((e) => e.type !== linkedType)
  }
}

/** 데미지 적용 (임시생명력 우선 소진) */
function applyDamageToCharacter(target: BattleCharacter, damage: number): void {
  if (target.tempHp > 0) {
    if (damage <= target.tempHp) {
      target.tempHp -= damage
    } else {
      const overflow = damage - target.tempHp
      target.tempHp = 0
      target.hp = Math.max(0, target.hp - overflow)
      // 임시생명력 소진 → 상태효과 + 연동 버프 제거
      removeStatusWithLinked(target, 'temp_hp')
    }
  } else {
    target.hp = Math.max(0, target.hp - damage)
  }
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
  const agility = getEffectiveAgility(defender)
  const isGraze = Math.random() * 100 < agility

  if (isCritical) {
    multiplier *= 2.0 + getEffectiveCritDamage(attacker) / 100
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

  // 이로운 효과 금지: buff_block 상태면 새 버프 차단
  if (isBuff && target.statusEffects.some((e) => e.type === 'buff_block')) {
    logs.push({
      type: 'immune',
      message: `${charLabel(target)} → 이로운 효과 금지! (버프 차단)`,
    })
    return
  }

  // 면역 판정
  if (checkImmunity(target, effect, logs)) return

  // 민첩에 의한 디버프 턴수 감소 (50%)
  let duration = effect.duration
  const targetAgility = getEffectiveAgility(target)
  if (category === 'debuff' && targetAgility > 0) {
    duration = Math.max(1, Math.round(duration * 0.5))
  }

  // atkScaling / spScaling: value를 시전자 스탯의 %로 계산
  const value = effect.atkScaling
    ? Math.round(getEffectiveAtk(actor) * effect.value / 100)
    : effect.spScaling
      ? Math.round(actor.supportPower * effect.value / 100)
      : effect.value

  const se: StatusEffect = {
    id: nextEffectId(),
    type: effect.type,
    value,
    remainingTurns: duration,
    category,
    buffType: isBuff ? effect.buffType : undefined,
    debuffClass: !isBuff ? effect.debuffClass : undefined,
    ignoreImmunity: effect.ignoreImmunity,
    dmgTakenUp: effect.dmgTakenUp,
    linkedBuffId: effect.linkedBuffId,
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
    if (effect.type === 'burn' || effect.type === 'bleed' || effect.type === 'poison' || effect.type === 'advanced_burn') {
      applyDamageToCharacter(actor, effect.value)
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

  // 만료된 효과의 연동 버프도 함께 제거
  const expiredEffects = actor.statusEffects.filter((e) => toRemove.includes(e.id))
  const linkedRemovals = expiredEffects
    .filter((e) => e.linkedBuffId)
    .map((e) => e.linkedBuffId!)
  // temp_hp 만료 시 tempHp 리셋
  if (expiredEffects.some((e) => e.type === 'temp_hp')) {
    actor.tempHp = 0
  }
  actor.statusEffects = actor.statusEffects.filter(
    (e) => !toRemove.includes(e.id) && !linkedRemovals.includes(e.type)
  )
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
  // 제거 대상 버프 수집 (연동 제거용)
  const toDispel = target.statusEffects.filter((e) => {
    if (e.category !== 'buff') return false
    if (isEnhanced && e.buffType === 'special') return false
    if (e.type.endsWith('_immune')) return false
    return true
  })
  const linkedRemovals = toDispel
    .filter((e) => e.linkedBuffId)
    .map((e) => e.linkedBuffId!)
  const dispelIds = new Set(toDispel.map((e) => e.id))
  // temp_hp 제거 시 tempHp 리셋
  if (toDispel.some((e) => e.type === 'temp_hp')) {
    target.tempHp = 0
  }
  target.statusEffects = target.statusEffects.filter(
    (e) => !dispelIds.has(e.id) && !linkedRemovals.includes(e.type)
  )
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
    applyDamageToCharacter(attacker, counterDamage)
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
      targetKey: `${attacker.team}-${attacker.templateId}`,
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
      const damage = calculateFullDamage(actor, target, effect.value / 100, multiplier)
      applyDamageToCharacter(target, damage)
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
        targetKey: `${target.team}-${target.templateId}`,
      })
      return
    }
    case 'def_scaling_damage': {
      // 철갑: (공격자 유효DEF / 100) × 공격자 유효ATK × (value / 100), 대상 DEF 무시
      const { multiplier, isCritical, isGraze } = rollCritGraze(actor, target)
      const rawDamage = (getEffectiveDef(actor) / 100) * getEffectiveAtk(actor) * (effect.value / 100)
      let damage = rawDamage * multiplier
      damage *= getDmgTakenMultiplier(target)
      damage *= calcShieldReduction(target)
      damage = Math.max(0, Math.round(damage))
      applyDamageToCharacter(target, damage)
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
        targetKey: `${target.team}-${target.templateId}`,
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
      // triggerSkill: 무효화 후 연쇄 스킬 발동
      if (effect.triggerSkill) {
        const triggered = getSkillById(effect.triggerSkill)
        if (triggered) {
          for (const te of triggered.effects) {
            applyEffect(te, triggered, actor, target, logs)
          }
        }
      }
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
    case 'temp_hp': {
      // 임시생명력: 시전자 maxHp × supportPower/100 × value/100
      const tempAmount = Math.round(actor.maxHp * actor.supportPower / 100 * effect.value / 100)
      target.tempHp = tempAmount
      // 지속 효과로도 등록 (duration 추적 + 연동 제거용)
      if (effect.duration) {
        applyStatusEffect(target, effect, actor, logs, skill.name)
      }
      return
    }
    case 'on_kill_heal_percent': {
      // 중복 등록 방지 (범위공격 시 타겟별로 호출되므로 1번만 등록)
      if (!actor.statusEffects.some((e) => e.type === 'pending_kill_heal')) {
        actor.statusEffects.push({
          id: nextEffectId(),
          type: 'pending_kill_heal',
          value: effect.value,
          remainingTurns: 0,
          category: 'buff',
        })
      }
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
  applyDamageToCharacter(target, damage)

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
    targetKey: `${target.team}-${target.templateId}`,
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

// ─── 턴 종료 처리 ───

function processPostTurn(
  actor: BattleCharacter,
  aliveBeforeTurn: Set<BattleCharacter>,
  logs: BattleLogEntry[]
): void {
  // 킬 시 회복 (pending_kill_heal)
  const killHeals = actor.statusEffects.filter((e) => e.type === 'pending_kill_heal')
  if (killHeals.length > 0) {
    const anyKilled = [...aliveBeforeTurn].some((e) => e.hp <= 0)
    if (anyKilled && actor.hp > 0) {
      for (const heal of killHeals) {
        const healAmount = Math.round(actor.maxHp * heal.value / 100)
        actor.hp = Math.min(actor.maxHp, actor.hp + healAmount)
        logs.push({
          type: 'buff',
          attacker: charLabel(actor),
          attackerTeam: actor.team,
          message: `${charLabel(actor)} → 적 처치! ${healAmount} 회복! (HP: ${actor.hp})`,
        })
      }
    }
    // 임시 상태효과 제거
    actor.statusEffects = actor.statusEffects.filter((e) => e.type !== 'pending_kill_heal')
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
  // 턴 시작 전 살아있는 적 스냅샷 (킬 판정용)
  const aliveBeforeTurn = new Set(enemies.filter((e) => e.hp > 0))

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

  const skills = actor.skills

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

  // 4. 일반공격 (지원형은 공격하지 않음)
  if (actor.type !== 'support') {
    executeNormalAttack(actor, allies, enemies, logs)
  }

  // 5. after_attack 스킬
  if (canUseSkills) {
    for (const skill of skills) {
      if (skill.timing === 'after_attack') {
        executeSkill(skill, actor, allies, enemies, logs)
      }
    }
  }

  // 6. 턴 종료 처리
  processPostTurn(actor, aliveBeforeTurn, logs)
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
    const skills = actor.skills

    for (const skill of skills) {
      if (skill.timing === 'passive') {
        const isPlayer = actor.team === 'player'
        executeSkill(skill, actor, isPlayer ? allies : enemies, isPlayer ? enemies : allies, logs)
      }
    }
  }
}
