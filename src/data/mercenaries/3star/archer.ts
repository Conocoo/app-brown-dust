import type { MercenaryTemplate } from '../../../types/mercenary'

export const archer: MercenaryTemplate = {
  id: 'archer',
  name: '궁수',
  type: 'attacker',
  star: 3,
  maxHp: 90,
  atk: 35,
  def: 8,
  emoji: '🏹',
  critRate: 20,
  critDamage: 10,
  agility: 15,
  skillIds: ['power_strike_1', 'power_strike_2', 'power_strike_3', 'power_strike_4'],
}
