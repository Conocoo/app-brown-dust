import type { MercenaryTemplate } from '../../../types/mercenary'

export const noel: MercenaryTemplate = {
  id: 'noel',
  name: '노엘',
  type: 'mage',
  star: 3,
  maxHp: 3133,
  atk: 2765,
  def: 0,
  emoji: '🔮',
  imageId: '355',
  critRate: 20,
  critDamage: 75,
  agility: 5,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'back_n',
    rangeSize: 2,
    effects: [],
  },
}
