import type { MercenaryTemplate } from '../../../types/mercenary'

export const corrupted_knight: MercenaryTemplate = {
  id: 'corrupted_knight',
  name: '타락한 기사',
  type: 'defender',
  star: 4,
  maxHp: 16716,
  atk: 3094,
  def: 10,
  emoji: '🛡️',
  imageId: '8805',
  critRate: 20,
  critDamage: 100,
  agility: 35,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [],
  },
}
