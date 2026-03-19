import type { MercenaryTemplate } from '../../../types/mercenary'

export const lorang: MercenaryTemplate = {
  id: 'lorang',
  name: '로랑',
  type: 'mage',
  star: 5,
  maxHp: 4724,
  atk: 2266,
  def: 0,
  emoji: '🔮',
  imageId: '1105',
  critRate: 25,
  critDamage: 75,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [],
  },
}
