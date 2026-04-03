// 룬 적용 로직 (3슬롯, 11종 스탯)
// 명세: Docs/명세/전투/03-스탯-계산.md §7.1

import type { RuneSlots } from '../types/rune'
import { getRuneByCode } from '../data/runes'
import type { ComputedStats } from './stat'

/**
 * 룬 3슬롯을 baseStats에 적용하여 최종 스탯 반환.
 *
 * 적용 방식 (03-스탯-계산.md):
 *  - atk_flat / hp_flat: SlotStatPlus 가산 → base 합산 후 승산
 *  - atk_percent / hp_percent: SlotStatMultiply 승산 factor
 *  - 나머지 (def, critRate 등): 단순 가산 (패턴 C)
 *
 * 단, runes.json의 percent 값은 소수 (0.0045 = 0.45%).
 * mercenaries.json의 비율 스탯은 정수% → 변환 필요.
 */
export function applyRunes(base: ComputedStats, runes: RuneSlots): ComputedStats {
  let atkFlat = 0
  let atkPercent = 0  // 소수 합산
  let hpFlat = 0
  let hpPercent = 0
  let defAdd = 0      // 정수% 가산
  let critRateAdd = 0
  let critDamageAdd = 0
  let agilityAdd = 0
  let patienceAdd = 0
  let piercingAdd = 0
  let spAdd = 0

  for (const slot of runes) {
    if (!slot) continue
    const runeData = getRuneByCode(slot.runeCode)
    if (!runeData) continue

    const { stat, value } = runeData.main
    switch (stat) {
      case 'atk_flat':      atkFlat += value; break
      case 'atk_percent':   atkPercent += value; break
      case 'hp_flat':       hpFlat += value; break
      case 'hp_percent':    hpPercent += value; break
      case 'def_percent':   defAdd += value * 100; break  // decimal → int%
      case 'crit_rate':     critRateAdd += value * 100; break
      case 'crit_damage':   critDamageAdd += value * 100; break
      case 'agility':       agilityAdd += value * 100; break
      case 'patience':      patienceAdd += value * 100; break
      case 'piercing':      piercingAdd += value * 100; break
      case 'support_power': spAdd += value; break
    }
  }

  // 패턴 A: ATK/HP = (base + flat) × (1 + percent)
  const finalAtk = Math.round((base.atk + atkFlat) * (1 + atkPercent))
  const finalHp = Math.round((base.hp + hpFlat) * (1 + hpPercent))

  return {
    atk: finalAtk,
    hp: finalHp,
    supportPower: base.supportPower + spAdd,
    def: base.def + defAdd,
    critRate: base.critRate + critRateAdd,
    critDamage: base.critDamage + critDamageAdd,
    agility: base.agility + agilityAdd,
    piercing: base.piercing + piercingAdd,
    patience: base.patience + patienceAdd,
  }
}
