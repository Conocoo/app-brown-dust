import type { MercenaryTemplate } from '../../../types/mercenary'

export const kuwik: MercenaryTemplate = {
  id: 'kuwik',
  name: '크윅',
  type: 'support',
  star: 4,
  maxHp: 1748,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '3355',
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
