import type { MercenaryTemplate } from '../../../types/mercenary'

export const britain: MercenaryTemplate = {
  id: 'britain',
  name: '브리튼',
  type: 'defender',
  star: 4,
  maxHp: 7483,
  atk: 1457,
  def: 15,
  emoji: '🛡️',
  imageId: '295',
  critRate: 35,
  critDamage: 85,
  agility: 10,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 3,
    effects: [],
  },
}
