import type { MercenaryTemplate } from '../../../types/mercenary'

export const asera: MercenaryTemplate = {
  id: 'asera',
  name: '아세라',
  type: 'support',
  star: 3,
  maxHp: 2150,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '2275',
  critRate: 0,
  critDamage: 0,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'next_ally',
    attackRange: 'x_shape',
    rangeSize: 1,
    effects: [],
  },
}
