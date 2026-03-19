import type { MercenaryTemplate } from '../../../types/mercenary'

export const ino: MercenaryTemplate = {
  id: 'ino',
  name: '이노',
  type: 'support',
  star: 4,
  maxHp: 2587,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '1265',
  critRate: 0,
  critDamage: 0,
  agility: 5,
  skill: {
    timing: 'after_attack',
    target: 'next_ally',
    attackRange: 'back_n',
    rangeSize: 1,
    effects: [],
  },
}
