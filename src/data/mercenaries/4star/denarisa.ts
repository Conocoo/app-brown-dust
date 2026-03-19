import type { MercenaryTemplate } from '../../../types/mercenary'

export const denarisa: MercenaryTemplate = {
  id: 'denarisa',
  name: '데나리사',
  type: 'defender',
  star: 4,
  maxHp: 6472,
  atk: 918,
  def: 10,
  emoji: '🛡️',
  imageId: '3015',
  critRate: 20,
  critDamage: 75,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [],
  },
}
