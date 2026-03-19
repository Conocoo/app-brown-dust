import type { MercenaryTemplate } from '../../../types/mercenary'

export const nowa: MercenaryTemplate = {
  id: 'nowa',
  name: '노와',
  type: 'support',
  star: 3,
  maxHp: 2447,
  atk: 0,
  def: 10,
  emoji: '💚',
  imageId: '4345',
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
