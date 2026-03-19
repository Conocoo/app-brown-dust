import type { MercenaryTemplate } from '../../../types/mercenary'

export const sabrina: MercenaryTemplate = {
  id: 'sabrina',
  name: '사브리나',
  type: 'support',
  star: 5,
  maxHp: 5941,
  atk: 0,
  def: 10,
  emoji: '💚',
  imageId: '2865',
  critRate: 0,
  critDamage: 0,
  agility: 30,
  skill: {
    timing: 'after_attack',
    target: 'next_ally',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [],
  },
}
