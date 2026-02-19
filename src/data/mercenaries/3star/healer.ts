import type { MercenaryTemplate } from '../../../types/mercenary'

export const healer: MercenaryTemplate = {
  id: 'healer',
  name: '성직자',
  type: 'support',
  star: 3,
  maxHp: 100,
  atk: 0,
  def: 12,
  emoji: '💚',
  critRate: 10,
  critDamage: 0,
  grazeRate: 10,
  skillIds: ['bless_1', 'bless_2', 'bless_3', 'bless_4'],
}
