import type { BattleCharacter, StatusEffect } from '../types/game'

/** 기본 데미지 계산: ATK × (1 - DEF/100). DEF는 % 감소율 */
export function calculateDamage(atk: number, defPercent: number): number {
  return atk * Math.max(0, 1 - defPercent / 100)
}

/** 상태 효과에서 특정 type의 합산 value 계산 */
function sumEffectValue(effects: StatusEffect[], type: string): number {
  return effects.filter((e) => e.type === type).reduce((sum, e) => sum + e.value, 0)
}

/** 채널별 합산: multiply 채널 합계 (channel 미지정 시 multiply 기본) */
function sumMultiply(effects: StatusEffect[], type: string): number {
  return effects
    .filter((e) => e.type === type && e.channel !== 'plus')
    .reduce((sum, e) => sum + e.value, 0)
}

/** 채널별 합산: plus 채널 합계 */
function sumPlus(effects: StatusEffect[], type: string): number {
  return effects
    .filter((e) => e.type === type && e.channel === 'plus')
    .reduce((sum, e) => sum + e.value, 0)
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/**
 * 버프/디버프 반영한 유효 공격력
 * 패턴 A: max(0, base * (1 + clamp(mul, -0.8, 3.0))) + plus
 */
export function getEffectiveAtk(char: BattleCharacter): number {
  const mulUp = sumMultiply(char.statusEffects, 'atk_up')
  const mulDown = sumMultiply(char.statusEffects, 'atk_down')
  const multiply = clamp((mulUp - mulDown) / 100, -0.8, 3.0)
  const plusUp = sumPlus(char.statusEffects, 'atk_up')
  const plusDown = sumPlus(char.statusEffects, 'atk_down')
  const plus = plusUp - plusDown
  return Math.max(0, char.atk * (1 + multiply)) + plus
}

/** 버프/디버프 반영한 유효 방어력 (% 기반, 합연산) */
export function getEffectiveDef(char: BattleCharacter): number {
  const bonus = sumEffectValue(char.statusEffects, 'def_up')
  const penalty = sumEffectValue(char.statusEffects, 'def_down')
  return Math.max(0, char.def + bonus - penalty)
}

/**
 * 버프 반영한 유효 치명확률
 * 패턴 B: clamp((base + plus) * (1 + mul), 0, 1)
 */
export function getEffectiveCritRate(char: BattleCharacter): number {
  const mulUp = sumMultiply(char.statusEffects, 'crit_up')
  const mulDown = sumMultiply(char.statusEffects, 'crit_rate_down')
  const multiply = (mulUp - mulDown) / 100
  const plusUp = sumPlus(char.statusEffects, 'crit_up')
  const plusDown = sumPlus(char.statusEffects, 'crit_rate_down')
  const plus = (plusUp - plusDown) / 100
  return clamp((char.critRate / 100 + plus) * (1 + multiply), 0, 1) * 100
}

/**
 * 버프/디버프 반영한 유효 치명피해
 * 패턴 B (상한 없음): max(0, (base + plus) * (1 + mul))
 */
export function getEffectiveCritDamage(char: BattleCharacter): number {
  const mulUp = sumMultiply(char.statusEffects, 'crit_damage_up')
  const mulDown = sumMultiply(char.statusEffects, 'crit_damage_down')
  const multiply = (mulUp - mulDown) / 100
  const plusUp = sumPlus(char.statusEffects, 'crit_damage_up')
  const plusDown = sumPlus(char.statusEffects, 'crit_damage_down')
  const plus = plusUp - plusDown
  return Math.max(0, (char.critDamage + plus) * (1 + multiply))
}

/**
 * 버프/디버프 반영한 유효 민첩
 * 패턴 B: clamp((base + plus) * (1 + mul), 0, 1)
 */
export function getEffectiveAgility(char: BattleCharacter): number {
  const mulUp = sumMultiply(char.statusEffects, 'agility_up')
  const mulDown = sumMultiply(char.statusEffects, 'agility_down')
  const multiply = (mulUp - mulDown) / 100
  const plusUp = sumPlus(char.statusEffects, 'agility_up')
  const plusDown = sumPlus(char.statusEffects, 'agility_down')
  const plus = (plusUp - plusDown) / 100
  return clamp((char.agility / 100 + plus) * (1 + multiply), 0, 1) * 100
}

/**
 * 버프/디버프 반영한 유효 피해 감소
 * 패턴 B: clamp((base + plus) * (1 + mul), 0, 1)
 */
export function getEffectiveDamageReduce(char: BattleCharacter): number {
  const mulUp = sumMultiply(char.statusEffects, 'damage_reduce_up')
  const mulDown = sumMultiply(char.statusEffects, 'damage_reduce_down')
  const multiply = (mulUp - mulDown) / 100
  const plusUp = sumPlus(char.statusEffects, 'damage_reduce_up')
  const plusDown = sumPlus(char.statusEffects, 'damage_reduce_down')
  const plus = (plusUp - plusDown) / 100
  return clamp((char.damageReduce / 100 + plus) * (1 + multiply), 0, 1)
}

/**
 * 보호율 계산 (원본: GetProtectedRate)
 * - shield_fix가 있으면 고정값 사용 (ProtectFix — 곱연산 스킵)
 * - 일반 shield는 곱연산 누적: rate = (1-v1/100) × (1-v2/100) × ...
 * - 상한: 최대 70% 감소 → rate 최소 0.3
 * @returns 데미지 배율 (0.3~1.0). 낮을수록 방어 높음
 */
export function calcProtectedRate(defender: BattleCharacter): number {
  // ProtectFix: 고정 보호율 (곱연산 스킵, 첫 번째 값 사용)
  const fix = defender.statusEffects.find((e) => e.type === 'shield_fix')
  if (fix) {
    return Math.max(0.3, 1 - fix.value / 100)
  }

  const shields = defender.statusEffects.filter((e) => e.type === 'shield')
  if (shields.length === 0) return 1.0

  let rate = 1.0
  for (const s of shields) {
    rate *= 1 - s.value / 100
  }
  // 상한: 최대 70% 감소 → rate 최소 0.3
  return Math.max(0.3, rate)
}

/**
 * 수신 데미지율 (원본: GetReciveDamageRate)
 * shield_penalty (피해 증가) 효과만 곱연산 누적
 * @returns 데미지 배율 (>= 1.0). 높을수록 피해 증가
 */
export function calcReciveDamageRate(defender: BattleCharacter): number {
  const penalties = defender.statusEffects.filter((e) => e.type === 'shield_penalty')
  if (penalties.length === 0) return 1.0

  let rate = 1.0
  for (const p of penalties) {
    rate *= 1 + p.value / 100
  }
  return rate
}

/** @deprecated Use calcProtectedRate instead */
export const calcShieldReduction = calcProtectedRate

/** 받는 피해량 증가 반영 (dmg_taken_up 효과 + 복합 상태효과의 dmgTakenUp 합산) */
export function getDmgTakenMultiplier(defender: BattleCharacter): number {
  const increase = sumEffectValue(defender.statusEffects, 'dmg_taken_up')
  const bundled = defender.statusEffects.reduce((sum, e) => sum + (e.dmgTakenUp ?? 0), 0)
  return 1 + (increase + bundled) / 100
}

/** 최종 데미지 계산 결과 */
export interface FullDamageResult {
  variableDamage: number
  fixedDamage: number
  totalDamage: number
}

/**
 * 최종 데미지 계산 (버프/디버프/보호막 모두 반영)
 * 고정/가변 데미지 분리: 고정 데미지는 DEF를 무시
 * 스침(graze)은 가변 데미지에만 적용
 */
export function calculateFullDamage(
  attacker: BattleCharacter,
  defender: BattleCharacter,
  skillMultiplier: number = 1.0,
  critMultiplier: number = 1.0,
  isGraze: boolean = false
): FullDamageResult {
  const atk = getEffectiveAtk(attacker)
  const def = getEffectiveDef(defender)
  const fixedRate = attacker.fixedDamageRate ?? 0

  // Variable damage: DEF applied
  const variableAtk = atk * (1 - fixedRate)
  let variableDamage = calculateDamage(variableAtk, def) * skillMultiplier * critMultiplier

  // Graze: 35% reduction to variable damage only
  if (isGraze) {
    variableDamage *= 0.65
  }

  // DamageReduce: variable damage only
  const damageReduce = getEffectiveDamageReduce(defender)
  if (damageReduce > 0) {
    variableDamage *= (1 - damageReduce)
  }

  // Fixed damage: DEF ignored
  let fixedDamage = atk * fixedRate * skillMultiplier * critMultiplier

  // dmg_taken_up applies to both
  const dmgTakenMul = getDmgTakenMultiplier(defender)
  variableDamage *= dmgTakenMul
  fixedDamage *= dmgTakenMul

  // ProtectedRate (shield) applies to both
  const protectedRate = calcProtectedRate(defender)
  variableDamage *= protectedRate
  fixedDamage *= protectedRate

  // ReciveDamageRate (shield_penalty) applies to both
  const reciveDmgRate = calcReciveDamageRate(defender)
  variableDamage *= reciveDmgRate
  fixedDamage *= reciveDmgRate

  const finalVariable = Math.max(0, Math.round(variableDamage))
  const finalFixed = Math.max(0, Math.round(fixedDamage))

  return {
    variableDamage: finalVariable,
    fixedDamage: finalFixed,
    totalDamage: finalVariable + finalFixed,
  }
}
