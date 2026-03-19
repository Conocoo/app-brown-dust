import type { MercenaryTemplate } from '../../../types/mercenary'

export const pierre: MercenaryTemplate = {
  id: 'pierre',
  name: '피에르',
  type: 'mage',
  star: 3,
  maxHp: 3003,
  atk: 2113,
  def: 5,
  emoji: '🔮',
  imageId: '375',
  critRate: 15,
  critDamage: 75,
  agility: 5,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [],
  },
}
