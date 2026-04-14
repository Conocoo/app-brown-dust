// 데미지 계산 로직
// 명세: Docs/명세/전투/07-데미지.md
// ProcessAttack 전체 파이프라인 구현

import { WELL512 } from './random'

// ─── 입력 타입 ────────────────────────────────────────────

/** 공격자 스탯 (데미지 계산에 필요한 부분) */
export interface AttackerStats {
  atk: number
  critRate: number        // % 정수 (예: 15 = 15%)
  critDamage: number      // % 정수 (예: 200 = 200%)
  piercing: number        // % 정수 (예: 30 = 30%)
  fixedDamageRate: number // [0.0, 1.0], 대부분 0
}

/** 방어자 스탯 (데미지 계산에 필요한 부분) */
export interface DefenderStats {
  def: number            // % 정수 (예: 30 = 30%, 피격률 = 1 - 0.30 = 0.70)
  hp: number
  agility: number        // % 정수, 스침 확률
  critResist: number     // % 정수, 치명타 피해 저항
}

// ─── 결과 타입 ────────────────────────────────────────────

export interface DamageResult {
  isCritical: boolean
  isDodge: boolean
  /** 가변 데미지 (방어/스침 적용) */
  variableDamage: number
  /** 고정 데미지 (방어/스침 무시) */
  fixedDamage: number
  /** 총 최종 데미지 */
  totalDamage: number
  /** 스침 발동 시 디버프 턴 감소 여부 */
  debuffTurnReduced: boolean
}

// ─── 상수 ─────────────────────────────────────────────────

const CRIT_ROLL_MAX = 10000
const DODGE_ROLL_MAX = 10000
/** 스침 시 가변 데미지 감소율 */
const GRAZE_DAMAGE_REDUCTION = 0.35
/** 스침 시 디버프 턴 감소율 */
const GRAZE_DEBUFF_REDUCTION = 0.5
/** 방어율 최대 경감 상한 (rate 최솟값 = 0.3 → 70% 경감) */
const PROTECT_RATE_MAX_LIMIT = 0.3

// ─── 핵심 함수 ────────────────────────────────────────────

/**
 * 유효 ATK 계산.
 * multiply 버프는 [-0.8, 3.0] 클램프 후 base_atk에 적용.
 * 이 함수는 버프 없이 raw ATK만 그대로 반환 (버프는 battle.ts에서 처리).
 */
export function effectiveAtk(atk: number, sumMultiply = 0, sumPlus = 0): number {
  const multiply = Math.max(-0.8, Math.min(3.0, sumMultiply))
  return Math.max(0, atk * (1 + multiply)) + sumPlus
}

/**
 * 방어율 계산 (곱연산 누적, 최솟값 0.3).
 * protectRates: 각 방어 버프의 rate 값 배열 (예: [0.7, 0.5] = 30%+50% 방어)
 */
export function calcProtectedRate(protectRates: number[]): number {
  let rate = 1.0
  for (const r of protectRates) {
    rate *= r
  }
  return Math.max(PROTECT_RATE_MAX_LIMIT, rate)
}

/**
 * 관통 적용 후 유효 방어율.
 * effective_def = protectedRate * (1 - piercing)
 */
export function effectiveDefRate(protectedRate: number, piercing: number): number {
  return Math.max(0, protectedRate * (1 - piercing))
}

/**
 * 데미지 계산 메인 함수.
 * rng가 없으면 확정 시나리오 (is_crit / is_dodge) 파라미터로 제어.
 */
export function calcDamage(
  attacker: AttackerStats,
  defender: DefenderStats,
  options: {
    rng?: WELL512
    forceCrit?: boolean
    forceDodge?: boolean
    /** 방어자 protectedRate (버프 없으면 1.0) */
    protectedRate?: number
    /** 방어자 피해증가 배율 (버프 없으면 1.0) */
    reciveDamageRate?: number
  } = {}
): DamageResult {
  const {
    rng,
    forceCrit = false,
    forceDodge = false,
    protectedRate = 1.0,
    reciveDamageRate = 1.0,
  } = options

  // 1. 기본 데미지
  let base = attacker.atk

  // 2. 치명타 판정
  let isCritical = forceCrit
  if (rng) {
    const roll = rng.getRandom(0, CRIT_ROLL_MAX)
    isCritical = (attacker.critRate / 100) > roll / CRIT_ROLL_MAX
  }

  if (isCritical) {
    const critDmgRate = attacker.critDamage / 100     // 200% → 2.0
    const critResist = defender.critResist / 100
    const effectiveCrit = Math.max(0, critDmgRate * (1 - critResist))
    base += base * effectiveCrit
  }

  // 3. 고정/가변 분리
  const fixedRate = Math.max(0, Math.min(1, attacker.fixedDamageRate))
  const fixedDamage = base * fixedRate
  let variableDamage = base - fixedDamage

  // 4. 스침 판정 (가변만)
  let isDodge = forceDodge
  if (rng) {
    const roll = rng.getRandom(0, DODGE_ROLL_MAX)
    isDodge = (defender.agility / 100) > roll / DODGE_ROLL_MAX
  }

  if (isDodge) {
    variableDamage -= variableDamage * GRAZE_DAMAGE_REDUCTION  // ×0.65
  }

  // 5. 방어율 적용 (가변만)
  // protectedRate는 피격률(통과율). 1.0=방어 없음, 0.3=최대 방어.
  // def → 피격률: (1.0 - def/100) 예: 30%방어 → 0.7 통과
  // 버프 → 곱연산 누적: protectedRate *= 각 버프값
  const defFraction = defender.def / 100
  const baseProtected = 1.0 - defFraction
  const combinedProtected = Math.max(PROTECT_RATE_MAX_LIMIT, baseProtected * protectedRate)
  const finalProtected = effectiveDefRate(combinedProtected, attacker.piercing / 100)

  // 명세 §5: variable = variable * protectedRate (통과율 적용)
  variableDamage = variableDamage * finalProtected * reciveDamageRate
  variableDamage = Math.max(0, variableDamage)

  // 명세 §3: 고정 데미지에도 피해증가 적용
  const finalFixed = Math.round(fixedDamage) * reciveDamageRate
  const totalDamage = Math.round(variableDamage) + Math.round(finalFixed)

  return {
    isCritical,
    isDodge,
    variableDamage: Math.round(variableDamage),
    fixedDamage: Math.round(fixedDamage),
    totalDamage,
    debuffTurnReduced: isDodge,  // 스침 발동 시 디버프 턴 50% 감소
  }
}

/**
 * 스침 발동 시 디버프 턴 감소 계산.
 * 명세 §4.1: reduced = floor(maxTurn * 0.5), currentTurn = maxTurn - reduced
 */
export function calcGrazeDebuffTurn(maxTurn: number): number {
  const reduced = Math.floor(maxTurn * GRAZE_DEBUFF_REDUCTION)
  return maxTurn - reduced
}

/**
 * 데미지 적용 파이프라인 시뮬레이션 (단일 대상, 버프 없음 간소화 버전).
 * 실제 전투에서는 battle.ts가 에너지가드/보너스HP/카운트가드를 처리한다.
 */
export function applyDamageToHp(
  currentHp: number,
  damage: number,
  bonusHp = 0,
): { remainingHp: number; remainingBonusHp: number; isDead: boolean } {
  let remaining = damage
  let remainingBonusHp = bonusHp

  // 보너스 HP 소모
  if (remainingBonusHp > 0) {
    if (remaining <= remainingBonusHp) {
      remainingBonusHp -= remaining
      remaining = 0
    } else {
      remaining -= remainingBonusHp
      remainingBonusHp = 0
    }
  }

  const remainingHp = Math.max(0, currentHp - remaining)
  return { remainingHp, remainingBonusHp, isDead: remainingHp <= 0 }
}
