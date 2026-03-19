import type { MercenaryTemplate } from '../../../types/mercenary'

export const gaius: MercenaryTemplate = {
  id: 'gaius',
  name: '가이우스',
  type: 'defender',
  star: 4,
  maxHp: 7767,
  atk: 1183,
  def: 10,
  emoji: '🛡️',
  imageId: '2815',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [],
  },
}
