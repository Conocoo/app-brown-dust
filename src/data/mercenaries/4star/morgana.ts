import type { MercenaryTemplate } from '../../../types/mercenary'

export const morgana: MercenaryTemplate = {
  id: 'morgana',
  name: '모르가나',
  type: 'mage',
  star: 4,
  maxHp: 3968,
  atk: 1342,
  def: 0,
  emoji: '🔮',
  imageId: '4155',
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
