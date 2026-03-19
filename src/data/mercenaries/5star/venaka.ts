import type { MercenaryTemplate } from '../../../types/mercenary'

export const venaka: MercenaryTemplate = {
  id: 'venaka',
  name: '베나카',
  type: 'support',
  star: 5,
  maxHp: 3214,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '2825',
  critRate: 0,
  critDamage: 0,
  agility: 30,
  skill: {
    timing: 'passive',
    target: 'next_ally',
    attackRange: 'horizontal',
    rangeSize: 3,
    effects: [],
  },
}
