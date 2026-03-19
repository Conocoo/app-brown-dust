import type { MercenaryTemplate } from '../../../types/mercenary'

export const hephaesia: MercenaryTemplate = {
  id: 'hephaesia',
  name: '헤파이시아',
  type: 'support',
  star: 4,
  maxHp: 1725,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '4135',
  critRate: 0,
  critDamage: 0,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'next_ally',
    attackRange: 'front_n',
    rangeSize: 3,
    effects: [],
  },
}
