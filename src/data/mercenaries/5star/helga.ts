import type { MercenaryTemplate } from '../../../types/mercenary'

export const helga: MercenaryTemplate = {
  id: 'helga',
  name: '헬가',
  type: 'mage',
  star: 5,
  maxHp: 259,
  atk: 2572,
  def: 0,
  emoji: '🔮',
  imageId: '4105',
  critRate: 50,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'passive',
    target: 'enemy_front',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [],
  },
}
