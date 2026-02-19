import type { MercenaryTemplate } from '../../../types/mercenary'

export const warrior: MercenaryTemplate = {
  id: 'warrior',
  name: '검투사',
  type: 'attacker',
  star: 3,
  maxHp: 120,
  atk: 30,
  def: 10,
  emoji: '⚔️',
  critRate: 15,
  critDamage: 0,
  grazeRate: 0,
  skillIds: ['power_strike_1', 'power_strike_2', 'power_strike_3', 'power_strike_4'],
}
