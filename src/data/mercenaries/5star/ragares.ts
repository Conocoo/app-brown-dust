import type { MercenaryTemplate } from '../../../types/mercenary'

export const ragares: MercenaryTemplate = {
  id: 'ragares',
  name: '라가레스',
  type: 'support',
  star: 5,
  maxHp: 8421,
  atk: 0,
  def: 5,
  emoji: '💚',
  imageId: '7045',
  critRate: 20,
  critDamage: 50,
  agility: 30,
  skill: {
    timing: 'passive',
    target: 'next_ally',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [],
  },
}
