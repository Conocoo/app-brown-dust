import type { MercenaryTemplate } from '../../../types/mercenary'

export const martina: MercenaryTemplate = {
  id: 'martina',
  name: '마르티나',
  type: 'defender',
  star: 4,
  maxHp: 11512,
  atk: 1579,
  def: 10,
  emoji: '🛡️',
  imageId: '2375',
  critRate: 10,
  critDamage: 50,
  agility: 40,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [],
  },
}
