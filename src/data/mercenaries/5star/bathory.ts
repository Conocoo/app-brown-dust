import type { MercenaryTemplate } from '../../../types/mercenary'

export const bathory: MercenaryTemplate = {
  id: 'bathory',
  name: '바토리',
  type: 'mage',
  star: 5,
  maxHp: 9787,
  atk: 2928,
  def: 0,
  emoji: '🔮',
  imageId: '2805',
  critRate: 20,
  critDamage: 50,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [],
  },
}
