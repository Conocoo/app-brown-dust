import type { MercenaryTemplate } from '../../../types/mercenary'

export const john: MercenaryTemplate = {
  id: 'john',
  name: '요한',
  type: 'support',
  star: 4,
  maxHp: 3030,
  atk: 0,
  def: 5,
  emoji: '💚',
  imageId: '1555',
  critRate: 0,
  critDamage: 0,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'next_ally',
    attackRange: 'single',
    effects: [],
  },
}
