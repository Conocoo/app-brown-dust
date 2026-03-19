import type { BattleCharacter, BattleLogEntry, StatusEffect } from '../types/game'
import type { CharacterSkill, SkillEffect } from '../types/skill'
import type { PlayRandomManager } from './random'
import { findNextAlly, resolveEnemyTarget, getTargetsInRange } from './targeting'
import { calculateFullDamage, getEffectiveCritRate, getEffectiveCritDamage, getEffectiveAgility, getEffectiveAtk, getEffectiveDef, calcProtectedRate, calcReciveDamageRate, getDmgTakenMultiplier } from './damage'
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

/**
 * 데미지 적용 파이프라인 (원본 SetDamage 순서)
 * 에너지 가드 → 임시생명력(보너스HP) → 1회 피해 상한 → HP 차감
 */
function applyDamageToCharacter(target: BattleCharacter, damage: number): void {
  let remaining = damage

  // 1. 에너지 가드: 별도 에너지 풀로 데미지 흡수
  const energyGuard = target.statusEffects.find(
    (e) => e.type === 'energy_guard' && e.value > 0
  )
  if (energyGuard) {
    if (remaining <= energyGuard.value) {
      energyGuard.value -= remaining
      return // 전량 흡수
    }
    remaining -= energyGuard.value
    energyGuard.value = 0
    // 에너지 소진 → 효과 제거
    target.statusEffects = target.statusEffects.filter((e) => e !== energyGuard)
  }

  // 2. 임시생명력 (보너스HP) 우선 소진
  if (target.tempHp > 0) {
    if (remaining <= target.tempHp) {
      target.tempHp -= remaining
      return
    }
    remaining -= target.tempHp
    target.tempHp = 0
    removeStatusWithLinked(target, 'temp_hp')
  }

  // 3. 1회 피해 상한 (EachDamageLimit)
  const dmgLimit = target.statusEffects.find((e) => e.type === 'each_damage_limit')
  if (dmgLimit && remaining > dmgLimit.value) {
    remaining = dmgLimit.value
  }

  // 4. HP 차감
  target.hp = Math.max(0, target.hp - remaining)
}

/**
 * 카운트 가드 체크: count_guard 상태효과가 있으면 데미지를 0으로 만들고 횟수 차감
 * @returns true if damage was blocked by count guard
 */
function checkCountGuard(
  target: BattleCharacter,
  logs: BattleLogEntry[]
): boolean {
  const guard = target.statusEffects.find(
    (e) => e.type === 'count_guard' && e.count !== undefined && e.count > 0
  )
  if (!guard) return false

  guard.count = (guard.count ?? 0) - 1
  logs.push({
    type: 'buff',
    defender: charLabel(target),
    message: `${charLabel(target)} → 카운트 가드! 공격 무효화 (잔여: ${guard.count}회)`,
    targetKey: `${target.team}-${target.templateId}`,
    targetStatusEffects: [...target.statusEffects],
  })

  // 횟수 소진 시 제거
  if (guard.count <= 0) {
    target.statusEffects = target.statusEffects.filter((e) => e !== guard)
    logs.push({
      type: 'buff',
      defender: charLabel(target),
      message: `${charLabel(target)} → 카운트 가드 소진!`,
      targetKey: `${target.team}-${target.templateId}`,
      targetStatusEffects: [...target.statusEffects],
    })
  }

  return true
}

/** 치명타/스침 판정 */
interface CritGrazeResult {
  /** crit multiplier only (graze is handled separately in calculateFullDamage) */
  critMultiplier: number
  isCritical: boolean
  isGraze: boolean
}

/** 치명타/스침 판정 (WELL512 RNG 기반, 만분율) */
function rollCritGraze(
  attacker: BattleCharacter,
  defender: BattleCharacter,
  rng: PlayRandomManager
): CritGrazeResult {
  let critMultiplier = 1.0
  const critRate = getEffectiveCritRate(attacker)
  // 백분율 → 만분율 변환 (7.5% → 750)
  const isCritical = rng.randomLessAndNotEqual(Math.round(critRate * 100))
  const agility = getEffectiveAgility(defender)
  const isGraze = rng.randomLessAndNotEqual(Math.round(agility * 100))

  if (isCritical) {
    const critDmgRate = 2.0 + getEffectiveCritDamage(attacker) / 100
    const critResist = defender.critResist ?? 0
    critMultiplier *= Math.max(0, critDmgRate * (1 - critResist))
  }

  return { critMultiplier, isCritical, isGraze }
}

// ─── 사망 판정 체인 ───
// 원본 게임: HP ≤ 0 → [1] 대신죽기(백로그) → [2] 환생 → [3] 사망콜백 → [4] 부활 → [5] 진짜사망

/**
 * 사망 판정 체인: 환생 → 사망콜백 → 부활 → 진짜 사망
 * 대신죽기는 백로그 (미구현)
 * @returns true if character survived (rebirth or revival)
 */
function processDieCheck(
  target: BattleCharacter,
  logs: BattleLogEntry[],
  rng: PlayRandomManager
): boolean {
  if (target.hp > 0) return false

  // [2] 환생 (Rebirth): 모든 버프 제거 + HP 복구 + 생존
  const rebirth = target.statusEffects.find((e) => e.type === 'rebirth')
  if (rebirth) {
    const hpPercent = rebirth.value || 100
    target.statusEffects = []
    target.hp = Math.round(target.maxHp * hpPercent / 100)
    target.tempHp = 0
    logs.push({
      type: 'rebirth',
      defender: charLabel(target),
      defenderHpAfter: target.hp,
      defenderMaxHp: target.maxHp,
      message: `${charLabel(target)} → 환생! (HP: ${target.hp}/${target.maxHp})`,
      targetKey: `${target.team}-${target.templateId}`,
      targetStatusEffects: [...target.statusEffects],
    })
    return true
  }

  // [3] 사망 콜백 (DieCallback): on_death_trigger 스킬 발동
  const deathTriggers = target.statusEffects.filter((e) => e.type === 'on_death_trigger')
  for (const trigger of deathTriggers) {
    if (trigger.linkedBuffId) {
      const skill = getSkillById(trigger.linkedBuffId)
      if (skill) {
        for (const te of skill.effects) {
          applyEffect(te, skill, target, target, logs, rng)
        }
      }
    }
  }

  // [4] 부활 (Revival): value% HP로 부활
  const revival = target.statusEffects.find((e) => e.type === 'revival')
  if (revival) {
    const hpPercent = revival.value || 50
    target.hp = Math.round(target.maxHp * hpPercent / 100)
    target.statusEffects = target.statusEffects.filter((e) => e.type !== 'revival')
    logs.push({
      type: 'revival',
      defender: charLabel(target),
      defenderHpAfter: target.hp,
      defenderMaxHp: target.maxHp,
      message: `${charLabel(target)} → 부활! (HP: ${target.hp}/${target.maxHp})`,
      targetKey: `${target.team}-${target.templateId}`,
      targetStatusEffects: [...target.statusEffects],
    })
    return true
  }

  // [5] 진짜 사망: 버프 해제 (사후 버프는 battle.ts에서 처리)
  target.statusEffects = []
  return false
}

/**
 * 사후 버프 처리: 진짜 사망한 캐릭터의 on_death_buff 효과를 아군에게 적용
 * battle.ts에서 턴 종료 후 호출
 */
export function processPostDeathBuffs(
  deadChar: BattleCharacter,
  allies: BattleCharacter[],
  enemies: BattleCharacter[],
  logs: BattleLogEntry[],
  deathBuffs: { type: string; linkedBuffId?: string }[],
  rng: PlayRandomManager
): void {
  for (const buff of deathBuffs) {
    if (!buff.linkedBuffId) continue
    const skill = getSkillById(buff.linkedBuffId)
    if (!skill) continue

    // 아군 사후 버프: 살아있는 아군에게 적용
    if (buff.type === 'on_death_buff_allies') {
      const aliveAllies = allies.filter((c) => c.hp > 0)
      for (const ally of aliveAllies) {
        for (const effect of skill.effects) {
          applyEffect(effect, skill, deadChar, ally, logs, rng)
        }
      }
      logs.push({
        type: 'post_death',
        attacker: charLabel(deadChar),
        attackerTeam: deadChar.team,
        message: `${charLabel(deadChar)} → 사망! 아군에게 ${skill.name} 발동!`,
      })
    }

    // 적군 사후 버프: 살아있는 적에게 적용
    if (buff.type === 'on_death_buff_enemies') {
      const aliveEnemies = enemies.filter((c) => c.hp > 0)
      for (const enemy of aliveEnemies) {
        for (const effect of skill.effects) {
          applyEffect(effect, skill, deadChar, enemy, logs, rng)
        }
      }
      logs.push({
        type: 'post_death',
        attacker: charLabel(deadChar),
        attackerTeam: deadChar.team,
        message: `${charLabel(deadChar)} → 사망! 적군에게 ${skill.name} 발동!`,
      })
    }
  }
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
  let value = effect.atkScaling
    ? Math.round(getEffectiveAtk(actor) * effect.value / 100)
    : effect.spScaling
      ? Math.round(actor.supportPower * effect.value / 100)
      : effect.value

  // 중독: 공격형 대상 3배
  if (effect.type === 'poison' && target.type === 'attacker') {
    value *= 3
  }

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
    channel: effect.channel,
    count: effect.count,
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
  logs: BattleLogEntry[],
  rng: PlayRandomManager
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
      if (actor.hp <= 0) {
        processDieCheck(actor, logs, rng)
        if (actor.hp <= 0) break // 진짜 사망 시 나머지 효과 처리 중단
      }
    }

    // 부패 DoT (최대HP 기반)
    if (effect.type === 'decay') {
      const decayDamage = Math.round(actor.maxHp * effect.value / 100)
      applyDamageToCharacter(actor, decayDamage)
      logs.push({
        type: 'debuff',
        defender: charLabel(actor),
        damage: decayDamage,
        defenderHpAfter: actor.hp,
        defenderMaxHp: actor.maxHp,
        defeated: actor.hp <= 0,
        message: `${charLabel(actor)} → 부패로 ${decayDamage} 피해! (HP: ${actor.hp})`,
      })
      if (actor.hp <= 0) {
        processDieCheck(actor, logs, rng)
        if (actor.hp <= 0) break // 진짜 사망 시 나머지 효과 처리 중단
      }
    }

    // 치명피해 지속 증가 (매 턴 스택 추가)
    if (effect.type === 'crit_damage_up_stacking') {
      actor.statusEffects.push({
        id: nextEffectId(),
        type: 'crit_damage_up',
        value: effect.value,
        remainingTurns: effect.remainingTurns,
        category: 'buff',
        buffType: 'stat_enhance',
      })
      logs.push({
        type: 'buff',
        defender: charLabel(actor),
        message: `${charLabel(actor)} → 치명피해 +${effect.value}% 누적!`,
      })
    }

    // 치명확률 지속 증가 (매 턴 스택 추가)
    if (effect.type === 'crit_up_stacking') {
      actor.statusEffects.push({
        id: nextEffectId(),
        type: 'crit_up',
        value: effect.value,
        remainingTurns: effect.remainingTurns,
        category: 'buff',
        buffType: 'stat_enhance',
      })
      logs.push({
        type: 'buff',
        defender: charLabel(actor),
        message: `${charLabel(actor)} → 치명확률 +${effect.value}% 누적!`,
      })
    }

    // 재생 (regeneration): 매 턴 최대HP% 회복
    if (effect.type === 'regeneration') {
      const curseEffect = actor.statusEffects.find((e) => e.type === 'curse')
      const curseReduction = curseEffect ? (1 - curseEffect.value / 100) : 1
      const healAmount = Math.round(actor.maxHp * effect.value / 100 * curseReduction)
      actor.hp = Math.min(actor.maxHp, actor.hp + healAmount)
      logs.push({
        type: 'buff',
        defender: charLabel(actor),
        message: `${charLabel(actor)} → 재생으로 ${healAmount} 회복! (HP: ${actor.hp})`,
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
  logs: BattleLogEntry[],
  rng: PlayRandomManager
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
    // 반격으로 사망 시 사망 판정 체인
    if (attacker.hp <= 0) {
      processDieCheck(attacker, logs, rng)
    }
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

/** 개별 효과 적용 */
function applyEffect(
  effect: SkillEffect,
  skill: { name?: string },
  actor: BattleCharacter,
  target: BattleCharacter,
  logs: BattleLogEntry[],
  rng: PlayRandomManager
): void {
  const actorLabel = charLabel(actor)
  const targetLabel = charLabel(target)

  // 즉시 효과
  switch (effect.type) {
    case 'damage': {
      if (checkCountGuard(target, logs)) return
      const { critMultiplier, isCritical, isGraze } = rollCritGraze(actor, target, rng)
      let { totalDamage } = calculateFullDamage(actor, target, effect.value / 100, critMultiplier, isGraze)
      // 화염 가드: 데미지 일부 흡수 + 반사
      totalDamage = processFlameGuard(actor, target, totalDamage, logs, rng)
      applyDamageToCharacter(target, totalDamage)
      logs.push({
        type: 'attack',
        attacker: actorLabel,
        attackerTeam: actor.team,
        defender: targetLabel,
        damage: totalDamage,
        defenderHpAfter: target.hp,
        defenderMaxHp: target.maxHp,
        defeated: target.hp <= 0,
        skillName: skill.name,
        isCritical,
        isGraze,
        targetKey: `${target.team}-${target.templateId}`,
      })
      if (target.hp <= 0) {
        processDieCheck(target, logs, rng)
      } else {
        processWoundedAddBuff(target, logs, rng)
      }
      return
    }
    case 'crit_scaling_damage': {
      if (checkCountGuard(target, logs)) return
      // 적중의 강타: critRate/100 × ATK × value/100
      const { critMultiplier, isCritical, isGraze } = rollCritGraze(actor, target, rng)
      const critRate = getEffectiveCritRate(actor)
      const rawDamage = (critRate / 100) * getEffectiveAtk(actor) * (effect.value / 100)
      let damage = rawDamage * critMultiplier
      if (isGraze) damage *= 0.65
      damage *= getDmgTakenMultiplier(target)
      damage *= calcProtectedRate(target)
      damage *= calcReciveDamageRate(target)
      damage = Math.max(0, Math.round(damage))
      damage = processFlameGuard(actor, target, damage, logs, rng)
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
      if (target.hp <= 0) {
        processDieCheck(target, logs, rng)
      } else {
        processWoundedAddBuff(target, logs, rng)
      }
      return
    }
    case 'def_scaling_damage': {
      if (checkCountGuard(target, logs)) return
      // 철갑: (공격자 유효DEF / 100) × 공격자 유효ATK × (value / 100), 대상 DEF 무시
      const { critMultiplier, isCritical, isGraze } = rollCritGraze(actor, target, rng)
      const rawDamage = (getEffectiveDef(actor) / 100) * getEffectiveAtk(actor) * (effect.value / 100)
      let damage = rawDamage * critMultiplier
      if (isGraze) damage *= 0.65
      damage *= getDmgTakenMultiplier(target)
      damage *= calcProtectedRate(target)
      damage *= calcReciveDamageRate(target)
      damage = Math.max(0, Math.round(damage))
      damage = processFlameGuard(actor, target, damage, logs, rng)
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
      if (target.hp <= 0) {
        processDieCheck(target, logs, rng)
      } else {
        processWoundedAddBuff(target, logs, rng)
      }
      return
    }
    case 'heal': {
      const { critMultiplier, isCritical } = rollCritGraze(actor, target, rng)
      const curseEffect = target.statusEffects.find((e) => e.type === 'curse')
      const curseReduction = curseEffect ? (1 - curseEffect.value / 100) : 1
      const healAmount = Math.round(effect.value * critMultiplier * curseReduction)
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
      const { critMultiplier, isCritical } = rollCritGraze(actor, target, rng)
      const curseEffect = target.statusEffects.find((e) => e.type === 'curse')
      const curseReduction = curseEffect ? (1 - curseEffect.value / 100) : 1
      const healAmount = Math.round(target.maxHp * effect.value / 100 * critMultiplier * curseReduction)
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
      applyDispel(target, false, actor, logs, skill.name ?? '')
      // triggerSkill: 무효화 후 연쇄 스킬 발동
      if (effect.triggerSkill) {
        const triggered = getSkillById(effect.triggerSkill)
        if (triggered) {
          for (const te of triggered.effects) {
            applyEffect(te, triggered, actor, target, logs, rng)
          }
        }
      }
      return
    }
    case 'dispel_enhance': {
      applyDispel(target, true, actor, logs, skill.name ?? '')
      return
    }
    case 'cleanse': {
      applyCleanse(target, actor, logs, skill.name ?? '')
      return
    }
    case 'purify_dot': {
      // DoT 디버프 일괄 제거
      const before = target.statusEffects.length
      target.statusEffects = target.statusEffects.filter(
        (e) => !(e.category === 'debuff' && e.debuffClass === 'dot')
      )
      const removed = before - target.statusEffects.length
      if (removed > 0) {
        logs.push({
          type: 'support',
          attackerTeam: actor.team,
          attacker: charLabel(actor),
          defender: charLabel(target),
          skillName: skill.name,
          message: `${charLabel(actor)} → ${charLabel(target)}의 DoT 디버프 ${removed}개 제거!`,
          targetKey: `${target.team}-${target.templateId}`,
          targetStatusEffects: [...target.statusEffects],
        })
      }
      return
    }
    case 'purify_cc': {
      // CC 디버프 일괄 제거
      const before = target.statusEffects.length
      target.statusEffects = target.statusEffects.filter(
        (e) => !(e.category === 'debuff' && e.debuffClass === 'cc')
      )
      const removed = before - target.statusEffects.length
      if (removed > 0) {
        logs.push({
          type: 'support',
          attackerTeam: actor.team,
          attacker: charLabel(actor),
          defender: charLabel(target),
          skillName: skill.name,
          message: `${charLabel(actor)} → ${charLabel(target)}의 CC 디버프 ${removed}개 제거!`,
          targetKey: `${target.team}-${target.templateId}`,
          targetStatusEffects: [...target.statusEffects],
        })
      }
      return
    }
    case 'temp_hp': {
      // 임시생명력: 시전자 maxHp × supportPower/100 × value/100
      const tempAmount = Math.round(actor.maxHp * actor.supportPower / 100 * effect.value / 100)
      target.tempHp = tempAmount
      // 지속 효과로도 등록 (duration 추적 + 연동 제거용)
      if (effect.duration) {
        applyStatusEffect(target, effect, actor, logs, skill.name ?? '')
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
    case 'on_kill_atk_up': {
      // 중복 등록 방지 (범위공격 시 타겟별로 호출되므로 1번만 등록)
      if (!actor.statusEffects.some((e) => e.type === 'pending_kill_atk_up')) {
        actor.statusEffects.push({
          id: nextEffectId(),
          type: 'pending_kill_atk_up',
          value: effect.value,
          remainingTurns: 0,
          category: 'buff',
          grantDuration: effect.duration,
        })
      }
      return
    }
    case 'giant_strike': {
      if (checkCountGuard(target, logs)) return
      // 최대HP% 추가 피해
      const gsDamage = Math.round(actor.maxHp * effect.value / 100)
      const gsProtect = calcProtectedRate(target)
      const gsDmgTaken = getDmgTakenMultiplier(target)
      const gsReciveDmg = calcReciveDamageRate(target)
      let finalGsDamage = Math.max(0, Math.round(gsDamage * gsProtect * gsDmgTaken * gsReciveDmg))
      finalGsDamage = processFlameGuard(actor, target, finalGsDamage, logs, rng)
      applyDamageToCharacter(target, finalGsDamage)
      logs.push({
        type: 'attack',
        attacker: actorLabel,
        attackerTeam: actor.team,
        defender: targetLabel,
        damage: finalGsDamage,
        defenderHpAfter: target.hp,
        defenderMaxHp: target.maxHp,
        defeated: target.hp <= 0,
        skillName: skill.name,
        targetKey: `${target.team}-${target.templateId}`,
      })
      if (target.hp <= 0) {
        processDieCheck(target, logs, rng)
      } else {
        processWoundedAddBuff(target, logs, rng)
      }
      return
    }
    case 'on_kill_trigger': {
      // 적 사망 시 triggerSkill 발동 등록 (중복 방지)
      if (effect.triggerSkill && !actor.statusEffects.some((e) => e.type === 'pending_kill_trigger')) {
        actor.statusEffects.push({
          id: nextEffectId(),
          type: 'pending_kill_trigger',
          value: 0,
          remainingTurns: 0,
          category: 'buff',
          linkedBuffId: effect.triggerSkill,
        })
      }
      return
    }
  }

  // 지속 효과 → 상태 효과 부여
  if (effect.duration) {
    applyStatusEffect(target, effect, actor, logs, skill.name ?? '')
    // triggerSkill: 상태 효과 부여 후 연쇄 스킬 발동
    if (effect.triggerSkill) {
      const triggered = getSkillById(effect.triggerSkill)
      if (triggered) {
        for (const te of triggered.effects) {
          applyEffect(te, triggered, actor, target, logs, rng)
        }
      }
    }
    return
  }

  // 기타
  logs.push({
    type: 'support',
    attackerTeam: actor.team,
    skillName: skill.name ?? '',
    message: `${actorLabel} → ${targetLabel}에게 ${skill.name ?? ''}!`,
  })
}

/** 캐릭터 스킬 실행 (CharacterSkill — 용병당 1개, 효과별 대상 오버라이드 지원) */
function executeCharSkill(
  skill: CharacterSkill,
  actor: BattleCharacter,
  allies: BattleCharacter[],
  enemies: BattleCharacter[],
  logs: BattleLogEntry[],
  rng: PlayRandomManager
): void {
  const skillIsEnemyTargeting = skill.target !== 'self' && skill.target !== 'next_ally'

  // 적 대상 스킬이면 메인 타겟 + 범위 대상 사전 결정
  let mainTarget: BattleCharacter | null = null
  let rangeTargets: BattleCharacter[] = []

  if (skillIsEnemyTargeting) {
    mainTarget = resolveEnemyTarget(actor, enemies, rng)
    if (mainTarget) {
      rangeTargets = getTargetsInRange(mainTarget, skill.attackRange, skill.rangeSize, enemies, actor)
    }
  } else if (skill.target === 'next_ally') {
    mainTarget = findNextAlly(actor, allies)
  } else {
    mainTarget = actor
  }

  for (const effect of skill.effects) {
    const effectTargetOverride = effect.target

    if (effectTargetOverride === 'self') {
      applyEffect(effect, skill, actor, actor, logs, rng)
    } else if (effectTargetOverride === 'next_ally') {
      const ally = findNextAlly(actor, allies)
      if (ally) applyEffect(effect, skill, actor, ally, logs, rng)
    } else if (skillIsEnemyTargeting) {
      for (const target of rangeTargets) {
        if (target.hp <= 0) continue
        applyEffect(effect, skill, actor, target, logs, rng)
      }
    } else if (mainTarget) {
      applyEffect(effect, skill, actor, mainTarget, logs, rng)
    }
  }
}

// ─── 화염 가드 / 피격 콜백 ───

/**
 * 화염 가드 (ProcessFlameGuard): 데미지 일부를 흡수하고 공격자에게 반사
 * @returns 흡수 후 남은 데미지
 */
function processFlameGuard(
  attacker: BattleCharacter,
  target: BattleCharacter,
  damage: number,
  logs: BattleLogEntry[],
  rng: PlayRandomManager
): number {
  const flameGuard = target.statusEffects.find((e) => e.type === 'flame_guard')
  if (!flameGuard || damage <= 0) return damage

  const absorbed = Math.round(damage * flameGuard.value / 100)
  if (absorbed <= 0) return damage

  const remaining = damage - absorbed

  // 반사: 흡수량을 공격자에게 반사 데미지로
  applyDamageToCharacter(attacker, absorbed)
  logs.push({
    type: 'reflect',
    attacker: charLabel(target),
    attackerTeam: target.team,
    defender: charLabel(attacker),
    damage: absorbed,
    defenderHpAfter: attacker.hp,
    defenderMaxHp: attacker.maxHp,
    defeated: attacker.hp <= 0,
    message: `${charLabel(target)} → 화염 가드! ${charLabel(attacker)}에게 ${absorbed} 반사!`,
    targetKey: `${attacker.team}-${attacker.templateId}`,
  })
  if (attacker.hp <= 0) {
    processDieCheck(attacker, logs, rng)
  }

  return remaining
}

/**
 * 피격 콜백 (WoundedAddBuff): 피격 시 연동 스킬 자동 발동
 * wounded_add_buff 상태효과의 linkedBuffId 스킬을 자신에게 적용
 */
function processWoundedAddBuff(
  target: BattleCharacter,
  logs: BattleLogEntry[],
  rng: PlayRandomManager
): void {
  const woundedBuffs = target.statusEffects.filter((e) => e.type === 'wounded_add_buff')
  for (const wb of woundedBuffs) {
    if (!wb.linkedBuffId) continue
    const skill = getSkillById(wb.linkedBuffId)
    if (!skill) continue
    for (const te of skill.effects) {
      applyEffect(te, skill, target, target, logs, rng)
    }
  }
}

// ─── 일반공격 ───

function executeNormalAttack(
  actor: BattleCharacter,
  enemies: BattleCharacter[],
  logs: BattleLogEntry[],
  rng: PlayRandomManager
): void {
  // 용병의 attackTarget으로 메인 타겟 선택
  const mainTarget = resolveEnemyTarget(actor, enemies, rng)
  if (!mainTarget) return

  // 용병의 attackRange로 범위 내 대상 목록
  const targets = getTargetsInRange(mainTarget, actor.skill.attackRange, actor.skill.rangeSize, enemies, actor)

  // 대상별 순차 처리 (개별 치명/스침 판정)
  for (const target of targets) {
    if (target.hp <= 0) continue
    attackSingleTarget(actor, target, logs, true, rng)
    if (actor.hp <= 0) break // 반격으로 사망 시 중단
  }
}

/** 단일 대상에 일반공격 실행 (치명/스침 개별 판정) */
function attackSingleTarget(
  actor: BattleCharacter,
  target: BattleCharacter,
  logs: BattleLogEntry[],
  allowCounter: boolean,
  rng: PlayRandomManager
): void {
  // 카운트 가드 체크
  if (checkCountGuard(target, logs)) return

  const { critMultiplier, isCritical, isGraze } = rollCritGraze(actor, target, rng)
  let { totalDamage: damage } = calculateFullDamage(actor, target, 1.0, critMultiplier, isGraze)

  // 화염 가드: 데미지 일부 흡수 + 반사
  damage = processFlameGuard(actor, target, damage, logs, rng)

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

  // 사망 판정 체인 (대상)
  if (target.hp <= 0) {
    processDieCheck(target, logs, rng)
  } else {
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

    // 중독 반격: 피격 시 공격자에게 중독 부여
    if (target.statusEffects.some((e) => e.type === 'poison_counter')) {
      const poisonValue = Math.round(getEffectiveAtk(target) * 12 / 100)
      // 공격형 대상 3배
      const multiplier = actor.type === 'attacker' ? 3 : 1
      const finalValue = poisonValue * multiplier
      actor.statusEffects.push({
        id: nextEffectId(),
        type: 'poison',
        value: finalValue,
        remainingTurns: 6,
        category: 'debuff',
        debuffClass: 'dot',
      })
      logs.push({
        type: 'debuff',
        attacker: charLabel(target),
        attackerTeam: target.team,
        defender: charLabel(actor),
        message: `${charLabel(target)} → ${charLabel(actor)}에게 중독 반격! (${finalValue}/턴, ${multiplier === 3 ? '공격형 3배, ' : ''}6턴)`,
        targetKey: `${actor.team}-${actor.templateId}`,
        targetStatusEffects: [...actor.statusEffects],
      })
    }

    // 피격 시 회복 (on_hit_recovery)
    if (target.statusEffects.some((e) => e.type === 'on_hit_recovery')) {
      const healAmount = Math.round(target.maxHp * 10 / 100)
      const curseEffect = target.statusEffects.find((e) => e.type === 'curse')
      const curseReduction = curseEffect ? (1 - curseEffect.value / 100) : 1
      const finalHeal = Math.round(healAmount * curseReduction)
      target.hp = Math.min(target.maxHp, target.hp + finalHeal)
      logs.push({
        type: 'buff',
        attacker: charLabel(target),
        attackerTeam: target.team,
        message: `${charLabel(target)} → 피격 시 회복으로 ${finalHeal} 회복! (HP: ${target.hp})`,
      })
    }

    // 피격 시 방어력 증가 (on_hit_def_up — 반사 신경)
    if (target.statusEffects.some((e) => e.type === 'on_hit_def_up')) {
      const defUpSkill = getSkillById('reflex_def_up')
      if (defUpSkill) {
        for (const te of defUpSkill.effects) {
          applyEffect(te, defUpSkill, target, target, logs, rng)
        }
      }
    }

    // 피격 콜백 (wounded_add_buff)
    processWoundedAddBuff(target, logs, rng)
  }

  // 반사반격 (반격 디버프는 이후 대상 공격에도 누적 적용)
  if (allowCounter && target.hp > 0) {
    processCounterAttack(actor, target, damage, logs, rng)
  }

  // 사망 판정 체인 (공격자 — 반격으로 사망 시)
  if (actor.hp <= 0) {
    processDieCheck(actor, logs, rng)
  }
}

// ─── 턴 종료 처리 ───

function processPostTurn(
  actor: BattleCharacter,
  aliveBeforeTurn: Set<BattleCharacter>,
  logs: BattleLogEntry[],
  rng: PlayRandomManager
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

  // 킬 시 공격력 증가 (pending_kill_atk_up) — 중첩 가능
  const killAtkUps = actor.statusEffects.filter((e) => e.type === 'pending_kill_atk_up')
  if (killAtkUps.length > 0) {
    const anyKilled = [...aliveBeforeTurn].some((e) => e.hp <= 0)
    if (anyKilled && actor.hp > 0) {
      for (const buff of killAtkUps) {
        actor.statusEffects.push({
          id: nextEffectId(),
          type: 'atk_up',
          value: buff.value,
          remainingTurns: buff.grantDuration ?? 24,
          category: 'buff',
          buffType: 'stat_enhance',
        })
        logs.push({
          type: 'buff',
          attacker: charLabel(actor),
          attackerTeam: actor.team,
          message: `${charLabel(actor)} → 적 처치! 공격력 +${buff.value}%!`,
        })
      }
    }
    actor.statusEffects = actor.statusEffects.filter((e) => e.type !== 'pending_kill_atk_up')
  }

  // 킬 시 트리거 스킬 발동 (pending_kill_trigger)
  const killTriggers = actor.statusEffects.filter((e) => e.type === 'pending_kill_trigger')
  if (killTriggers.length > 0) {
    const anyKilled = [...aliveBeforeTurn].some((e) => e.hp <= 0)
    if (anyKilled && actor.hp > 0) {
      for (const trigger of killTriggers) {
        const triggeredSkill = trigger.linkedBuffId ? getSkillById(trigger.linkedBuffId) : undefined
        if (triggeredSkill) {
          for (const te of triggeredSkill.effects) {
            applyEffect(te, triggeredSkill, actor, actor, logs, rng)
          }
        }
      }
    }
    actor.statusEffects = actor.statusEffects.filter((e) => e.type !== 'pending_kill_trigger')
  }
}

// ─── 메인 턴 실행 ───

/** 한 캐릭터의 턴 실행 */
export function executeTurn(
  actor: BattleCharacter,
  alliesParam: BattleCharacter[],
  enemiesParam: BattleCharacter[],
  logs: BattleLogEntry[],
  rng: PlayRandomManager
): void {
  let allies = alliesParam
  let enemies = enemiesParam

  // 턴 시작 전 살아있는 적 스냅샷 (킬 판정용)
  const aliveBeforeTurn = new Set(enemies.filter((e) => e.hp > 0))

  // 1. 턴 시작: 지속 효과 처리
  processTurnStart(actor, logs, rng)
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

  // 혼란(charm): 아군↔적 리스트 스왑 (원본: GetOwnerList/GetEnemyList 교환)
  // 스킬도 정상 발동, 범위 공격도 적용 — 단지 타겟이 반전됨
  if (isCharmed(actor)) {
    const temp = allies
    allies = enemies
    enemies = temp
    logs.push({
      type: 'debuff',
      defender: charLabel(actor),
      message: `${charLabel(actor)} → 혼란 상태! 아군을 적으로 인식!`,
    })
  }

  const canUseSkills = !isSilenced(actor)
  const charSkill = actor.skill

  // 3. before_attack 스킬
  if (canUseSkills && charSkill.timing === 'before_attack') {
    executeCharSkill(charSkill, actor, allies, enemies, logs, rng)
  }

  // 4. 일반공격 (지원형은 공격하지 않음)
  if (actor.type !== 'support') {
    executeNormalAttack(actor, enemies, logs, rng)
  }

  // 5. after_attack 스킬
  if (canUseSkills && charSkill.timing === 'after_attack') {
    executeCharSkill(charSkill, actor, allies, enemies, logs, rng)
  }

  // 6. 자폭: 모든 스킬 발동 후 자신 즉사
  if (actor.selfDestruct && actor.hp > 0) {
    actor.hp = 0
    logs.push({
      type: 'attack',
      attacker: charLabel(actor),
      attackerTeam: actor.team,
      defender: charLabel(actor),
      damage: 0,
      defenderHpAfter: 0,
      defenderMaxHp: actor.maxHp,
      defeated: true,
      message: `${charLabel(actor)} → 자폭! 즉사!`,
      targetKey: `${actor.team}-${actor.templateId}`,
    })
    return
  }

  // 7. 턴 종료 처리
  processPostTurn(actor, aliveBeforeTurn, logs, rng)
}

/** passive 스킬 일괄 발동 (게임 시작 시) */
export function applyPassiveSkills(
  allCharacters: BattleCharacter[],
  allies: BattleCharacter[],
  enemies: BattleCharacter[],
  logs: BattleLogEntry[],
  rng: PlayRandomManager
): void {
  for (const actor of allCharacters) {
    if (actor.hp <= 0) continue
    if (actor.skill.timing === 'passive') {
      const isPlayer = actor.team === 'player'
      executeCharSkill(actor.skill, actor, isPlayer ? allies : enemies, isPlayer ? enemies : allies, logs, rng)
    }
  }
}
