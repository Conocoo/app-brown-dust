import type { MercenaryTemplate } from '../../../types/mercenary'

export const grosa: MercenaryTemplate = {
  id: 'grosa',
  name: '그로사',
  type: 'defender',
  star: 4,
  maxHp: 20148,
  atk: 877,
  def: 20,
  emoji: '🛡️',
  imageId: '1405',
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
