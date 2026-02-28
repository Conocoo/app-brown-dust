import type { Rune, RuneStat } from '../types/game'

/**
 * 룬 목록에서 각 스탯 합산값을 계산한다.
 */
function sumRuneStats(runes: Rune[]): Record<RuneStat, number> {
  const total: Record<RuneStat, number> = {
    hp_percent: 0,
    hp_flat: 0,
    atk_percent: 0,
    atk_flat: 0,
    def: 0,
    crit_rate: 0,
    crit_damage: 0,
  }
  for (const rune of runes) {
    total[rune.main.stat] += rune.main.value
    if (rune.main2) total[rune.main2.stat] += rune.main2.value
    if (rune.sub)   total[rune.sub.stat]   += rune.sub.value
  }
  return total
}

/**
 * 룬 스탯을 BattleCharacter 기본 스탯에 반영한 결과를 반환한다.
 *
 * 공식:
 *   최종 HP        = (baseHp  + hp_flat)  × (1 + hp_percent  / 100)
 *   최종 ATK       = (baseAtk + atk_flat) × (1 + atk_percent / 100)
 *   최종 DEF       = baseDef  + def
 *   최종 critRate  = baseCritRate  + crit_rate
 *   최종 critDmg   = baseCritDmg   + crit_damage
 */
export function applyRunes(
  base: { maxHp: number; atk: number; def: number; critRate: number; critDamage: number },
  runes: Rune[] | undefined,
): { maxHp: number; atk: number; def: number; critRate: number; critDamage: number } {
  if (!runes || runes.length === 0) return base

  const s = sumRuneStats(runes)

  return {
    maxHp:      Math.round((base.maxHp  + s.hp_flat)  * (1 + s.hp_percent  / 100)),
    atk:        Math.round((base.atk    + s.atk_flat) * (1 + s.atk_percent / 100)),
    def:        base.def        + s.def,
    critRate:   base.critRate   + s.crit_rate,
    critDamage: base.critDamage + s.crit_damage,
  }
}
