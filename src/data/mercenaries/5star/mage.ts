import type { MercenaryTemplate } from '../../../types/mercenary'

export const mage: MercenaryTemplate = {
  id: 'mage',
  name: '마법사',
  type: 'mage',
  star: 5,
  maxHp: 80,
  atk: 45,
  def: 5,
  emoji: '🔮',
  critRate: 25,
  critDamage: 20,
  grazeRate: 0,
  skillIds: ['magic_bolt', 'power_strike_1', 'power_strike_2', 'power_strike_3'],
}
