import type { MercenaryTemplate } from '../../../types/mercenary'

export const gloria: MercenaryTemplate = {
  id: 'gloria',
  name: '글로리아',
  type: 'defender',
  star: 5,
  maxHp: 14367,
  atk: 1112,
  def: 15,
  emoji: '🛡️',
  imageId: '2355',
  critRate: 20,
  critDamage: 75,
  agility: 10,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [],
  },
}
