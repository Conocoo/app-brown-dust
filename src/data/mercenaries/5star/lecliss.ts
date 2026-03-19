import type { MercenaryTemplate } from '../../../types/mercenary'

export const lecliss: MercenaryTemplate = {
  id: 'lecliss',
  name: '레클리스',
  type: 'defender',
  star: 5,
  maxHp: 8813,
  atk: 993,
  def: 0,
  emoji: '🛡️',
  imageId: '3555',
  critRate: 0,
  critDamage: 25,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [],
  },
}
