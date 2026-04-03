// 스탯 계산 로직
// 명세: Docs/명세/전투/03-스탯-계산.md

import type { MercenaryData } from '../types/character'

// ─── 레벨 배율 ──────────────────────────────────────────

/**
 * CharBalanceData.GetLevelMultiply
 * levelMultiply = (level-1) + 5.0 × floor(level / 10)
 */
export function levelMultiply(level: number): number {
  return (level - 1) + 5.0 * Math.floor(level / 10)
}

// ─── 타입별 성장률 ────────────────────────────────────────

/** ATK/HP 성장률 (타입별). 비율 스탯은 레벨 성장 없음. */
const GROWTH_ATK: Record<string, number> = {
  attacker: 0.01,
  defender: 0.01,
  mage: 0.01,
  support: 0,
}
const GROWTH_HP: Record<string, number> = {
  attacker: 0.01,
  defender: 0.01,
  mage: 0.01,
  support: 0.01,
}
const GROWTH_SP: Record<string, number> = {
  support: 0.003,
}

/**
 * 레벨별 스탯 계산 (공식 기반).
 * stat = base + base × growthRate × levelMultiply(level)
 */
export function scaleByLevel(base: number, growthRate: number, level: number): number {
  return base + base * growthRate * levelMultiply(level)
}

// ─── 최종 스탯 타입 ───────────────────────────────────────

export interface ComputedStats {
  atk: number
  hp: number
  supportPower: number
  /** 방어율 % */
  def: number
  /** 치명타 확률 % */
  critRate: number
  /** 치명타 피해 % */
  critDamage: number
  /** 회피율 % */
  agility: number
  /** 관통 % */
  piercing: number
  /** 인내 % */
  patience: number
}

/**
 * 주어진 레벨에서의 스탯 계산.
 * ATK/HP는 레벨 성장. 비율 스탯(def, critRate 등)은 그대로.
 * baseLv1이 없으면 max stats를 사용.
 */
export function calcStatsAtLevel(merc: MercenaryData, level: number): ComputedStats {
  if (merc.baseLv1) {
    const lm = levelMultiply(level)
    const atkGrowth = GROWTH_ATK[merc.type] ?? 0
    const hpGrowth = GROWTH_HP[merc.type] ?? 0
    const spGrowth = GROWTH_SP[merc.type] ?? 0
    return {
      atk: Math.round(merc.baseLv1.atk + merc.baseLv1.atk * atkGrowth * lm),
      hp: Math.round(merc.baseLv1.hp + merc.baseLv1.hp * hpGrowth * lm),
      supportPower: Math.round(
        merc.baseLv1.supportPower + merc.baseLv1.supportPower * spGrowth * lm
      ),
      def: merc.def,
      critRate: merc.critRate,
      critDamage: merc.critDamage,
      agility: merc.agility,
      piercing: merc.piercing,
      patience: merc.patience,
    }
  }
  // fallback: max stats
  return maxStats(merc)
}

/** 최대 레벨 스탯 (mercenaries.json에 저장된 값) */
export function maxStats(merc: MercenaryData): ComputedStats {
  return {
    atk: merc.atk,
    hp: merc.maxHp,
    supportPower: merc.supportPower ?? 0,
    def: merc.def,
    critRate: merc.critRate,
    critDamage: merc.critDamage,
    agility: merc.agility,
    piercing: merc.piercing,
    patience: merc.patience,
  }
}
