import type { MercenaryTemplate } from '../../../types/mercenary'

export const freesia: MercenaryTemplate = {
  id: 'freesia',
  name: '프리시아',
  type: 'mage',
  star: 5,
  maxHp: 2934,
  atk: 3576,
  def: 0,
  emoji: '🔮',
  imageId: '3095',
  critRate: 20,
  critDamage: 75,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'cross',
    rangeSize: 2,
    effects: [],
  },
}
