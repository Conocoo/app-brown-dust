import type { MercenaryTemplate } from '../../../types/mercenary'

export const stella: MercenaryTemplate = {
  id: 'stella',
  name: '스텔라',
  type: 'support',
  star: 5,
  maxHp: 1394,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '3895',
  critRate: 80,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'next_ally',
    attackRange: 'horizontal',
    rangeSize: 4,
    effects: [],
  },
}
