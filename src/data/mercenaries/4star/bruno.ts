import type { MercenaryTemplate } from '../../../types/mercenary'

export const bruno: MercenaryTemplate = {
  id: 'bruno',
  name: '브루노',
  type: 'mage',
  star: 4,
  maxHp: 2587,
  atk: 2130,
  def: 0,
  emoji: '🔮',
  imageId: '915',
  critRate: 15,
  critDamage: 75,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'cross',
    rangeSize: 2,
    effects: [],
  },
}
