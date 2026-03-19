import type { MercenaryTemplate } from '../../../types/mercenary'

export const isabel: MercenaryTemplate = {
  id: 'isabel',
  name: '이자벨',
  type: 'support',
  star: 4,
  maxHp: 5671,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '3925',
  critRate: 0,
  critDamage: 0,
  agility: 10,
  skill: {
    timing: 'passive',
    target: 'next_ally',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [],
  },
}
