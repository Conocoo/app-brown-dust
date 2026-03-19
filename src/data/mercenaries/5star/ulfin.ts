import type { MercenaryTemplate } from '../../../types/mercenary'

export const ulfin: MercenaryTemplate = {
  id: 'ulfin',
  name: '울핀',
  type: 'mage',
  star: 5,
  maxHp: 5667,
  atk: 2446,
  def: 95,
  emoji: '🔮',
  imageId: '7025',
  critRate: 30,
  critDamage: 50,
  agility: 10,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'cross',
    rangeSize: 2,
    effects: [],
  },
}
