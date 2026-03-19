import type { MercenaryTemplate } from '../../../types/mercenary'

export const indra: MercenaryTemplate = {
  id: 'indra',
  name: '인드라',
  type: 'support',
  star: 5,
  maxHp: 6291,
  atk: 0,
  def: 10,
  emoji: '💚',
  imageId: '4475',
  critRate: 0,
  critDamage: 0,
  agility: 5,
  skill: {
    timing: 'passive',
    target: 'next_ally',
    attackRange: 'single',
    effects: [],
  },
}
