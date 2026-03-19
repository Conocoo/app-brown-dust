import type { MercenaryTemplate } from '../../../types/mercenary'

export const biobi_hornet: MercenaryTemplate = {
  id: 'biobi_hornet',
  name: '비오비 독벌',
  type: 'mage',
  star: 4,
  maxHp: 1194,
  atk: 6965,
  def: 0,
  emoji: '🔮',
  imageId: '8330',
  critRate: 100,
  critDamage: 100,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'cross',
    rangeSize: 2,
    effects: [],
  },
}
