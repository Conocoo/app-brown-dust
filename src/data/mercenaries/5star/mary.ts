import type { MercenaryTemplate } from '../../../types/mercenary'

export const mary: MercenaryTemplate = {
  id: 'mary',
  name: '메리',
  type: 'support',
  star: 5,
  maxHp: 3355,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '1525',
  critRate: 0,
  critDamage: 0,
  agility: 15,
  skill: {
    timing: 'passive',
    target: 'next_ally',
    attackRange: 'front_n',
    rangeSize: 1,
    effects: [],
  },
}
