import type { BattleCharacter, StatusEffect } from '../types/game'

/** 기본 데미지 계산: ATK × (1 - DEF/100). DEF는 % 감소율 */
export function calculateDamage(atk: number, defPercent: number): number {
  return atk * Math.max(0, 1 - defPercent / 100)
}

/** 상태 효과에서 특정 type의 합산 value 계산 */
function sumEffectValue(effects: StatusEffect[], type: string): number {
  return effects.filter((e) => e.type === type).reduce((sum, e) => sum + e.value, 0)
}

/** 버프/디버프 반영한 유효 공격력 (기본 ATK의 %, 상한 +300%) */
export function getEffectiveAtk(char: BattleCharacter): number {
  const bonus = sumEffectValue(char.statusEffects, 'atk_up')
  const penalty = sumEffectValue(char.statusEffects, 'atk_down')
  const rate = Math.min(bonus - penalty, 300) // +300% 상한
  return Math.max(0, char.atk * (1 + rate / 100))
}

/** 버프/디버프 반영한 유효 방어력 (% 기반, 합연산) */
export function getEffectiveDef(char: BattleCharacter): number {
  const bonus = sumEffectValue(char.statusEffects, 'def_up')
  const penalty = sumEffectValue(char.statusEffects, 'def_down')
  return Math.max(0, char.def + bonus - penalty)
}

/** 버프 반영한 유효 치명확률 */
export function getEffectiveCritRate(char: BattleCharacter): number {
  const bonus = sumEffectValue(char.statusEffects, 'crit_up')
  const penalty = sumEffectValue(char.statusEffects, 'crit_rate_down')
  return Math.max(0, char.critRate + bonus - penalty)
}

/** 보호막 감소율 계산 (곱연산, 상한 -70%) */
export function calcShieldReduction(defender: BattleCharacter): number {
  const shields = defender.statusEffects.filter((e) => e.type === 'shield')
  if (shields.length === 0) return 1.0

  let multiplier = 1.0
  for (const s of shields) {
    multiplier *= 1 - s.value / 100
  }
  // 상한: 최대 70% 감소 → multiplier 최소 0.3
  return Math.max(0.3, multiplier)
}

/** 받는 피해량 증가 반영 (dmg_taken_up 효과 + 복합 상태효과의 dmgTakenUp 합산) */
export function getDmgTakenMultiplier(defender: BattleCharacter): number {
  const increase = sumEffectValue(defender.statusEffects, 'dmg_taken_up')
  const bundled = defender.statusEffects.reduce((sum, e) => sum + (e.dmgTakenUp ?? 0), 0)
  return 1 + (increase + bundled) / 100
}

/**
 * 최종 데미지 계산 (버프/디버프/보호막 모두 반영)
 * 스침(graze)은 rollCritGraze에서 agility 기반으로 처리됨
 */
export function calculateFullDamage(
  attacker: BattleCharacter,
  defender: BattleCharacter,
  skillMultiplier: number = 1.0,
  critGrazeMultiplier: number = 1.0
): number {
  const atk = getEffectiveAtk(attacker)
  const def = getEffectiveDef(defender)
  const baseDamage = calculateDamage(atk, def)

  let damage = baseDamage * skillMultiplier * critGrazeMultiplier

  // 받는 피해량 증가
  damage *= getDmgTakenMultiplier(defender)

  // 보호막 곱연산
  damage *= calcShieldReduction(defender)

  return Math.max(0, Math.round(damage))
}
