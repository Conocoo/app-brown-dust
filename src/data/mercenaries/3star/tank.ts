import type { MercenaryTemplate } from '../../../types/mercenary'

export const tank: MercenaryTemplate = {
  id: 'tank',
  name: '수호자',
  type: 'defender',
  star: 3,
  maxHp: 180,
  atk: 15,
  def: 25,
  emoji: '🛡️',
  critRate: 5,
  critDamage: 0,
  agility: 20,
  skillIds: ['power_strike_1', 'power_strike_2', 'power_strike_3', 'power_strike_4'],
}
