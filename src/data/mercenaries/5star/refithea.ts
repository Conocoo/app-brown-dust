import type { MercenaryTemplate } from '../../../types/mercenary'

export const refithea: MercenaryTemplate = {
  id: 'refithea',
  name: '레피테아',
  type: 'support',
  star: 5,
  maxHp: 5505,
  atk: 0,
  def: 5,
  emoji: '💚',
  imageId: '1855',
  critRate: 20,
  critDamage: 50,
  agility: 65,
  skill: {
    timing: 'passive',
    target: 'next_ally',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [],
  },
}
