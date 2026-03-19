import type { MercenaryTemplate } from '../../../types/mercenary'

export const laura: MercenaryTemplate = {
  id: 'laura',
  name: '라우라',
  type: 'support',
  star: 5,
  maxHp: 3776,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '3785',
  critRate: 0,
  critDamage: 0,
  agility: 40,
  skill: {
    timing: 'after_attack',
    target: 'next_ally',
    attackRange: 'horizontal',
    rangeSize: 3,
    effects: [],
  },
}
