import type { MercenaryTemplate } from '../../../types/mercenary'

export const sandstorm_warrior: MercenaryTemplate = {
  id: 'sandstorm_warrior',
  name: '모래바람 전사',
  type: 'defender',
  star: 4,
  maxHp: 16716,
  atk: 4151,
  def: 10,
  emoji: '🛡️',
  imageId: '8802',
  critRate: 20,
  critDamage: 100,
  agility: 35,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [],
  },
}
