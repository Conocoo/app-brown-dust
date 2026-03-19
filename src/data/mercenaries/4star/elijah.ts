import type { MercenaryTemplate } from '../../../types/mercenary'

export const elijah: MercenaryTemplate = {
  id: 'elijah',
  name: '엘리야',
  type: 'support',
  star: 4,
  maxHp: 2465,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '1535',
  critRate: 0,
  critDamage: 0,
  agility: 5,
  skill: {
    timing: 'after_attack',
    target: 'next_ally',
    attackRange: 'x_shape',
    rangeSize: 1,
    effects: [],
  },
}
