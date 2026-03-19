import type { MercenaryTemplate } from '../../../types/mercenary'

export const velfern: MercenaryTemplate = {
  id: 'velfern',
  name: '벨페른',
  type: 'mage',
  star: 5,
  maxHp: 5505,
  atk: 3569,
  def: 5,
  emoji: '🔮',
  imageId: '2915',
  critRate: 20,
  critDamage: 50,
  agility: 35,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [],
  },
}
