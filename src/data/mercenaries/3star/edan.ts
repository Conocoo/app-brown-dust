import type { MercenaryTemplate } from '../../../types/mercenary'

export const edan: MercenaryTemplate = {
  id: 'edan',
  name: '에단',
  type: 'support',
  star: 3,
  maxHp: 2039,
  atk: 0,
  def: 5,
  emoji: '💚',
  imageId: '2225',
  critRate: 0,
  critDamage: 0,
  agility: 10,
  skill: {
    timing: 'after_attack',
    target: 'next_ally',
    attackRange: 'x_shape',
    rangeSize: 1,
    effects: [],
  },
}
