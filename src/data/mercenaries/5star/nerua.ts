import type { MercenaryTemplate } from '../../../types/mercenary'

export const nerua: MercenaryTemplate = {
  id: 'nerua',
  name: '네루아',
  type: 'mage',
  star: 5,
  maxHp: 1628,
  atk: 3859,
  def: 0,
  emoji: '🔮',
  imageId: '4195',
  critRate: 0,
  critDamage: 0,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [],
  },
}
