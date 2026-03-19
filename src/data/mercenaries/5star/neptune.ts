import type { MercenaryTemplate } from '../../../types/mercenary'

export const neptune: MercenaryTemplate = {
  id: 'neptune',
  name: '넵튠',
  type: 'mage',
  star: 5,
  maxHp: 2935,
  atk: 3528,
  def: 5,
  emoji: '🔮',
  imageId: '4615',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 3,
    effects: [],
  },
}
