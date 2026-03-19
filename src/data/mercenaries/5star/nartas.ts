import type { MercenaryTemplate } from '../../../types/mercenary'

export const nartas: MercenaryTemplate = {
  id: 'nartas',
  name: '나르타스',
  type: 'mage',
  star: 5,
  maxHp: 5115,
  atk: 3342,
  def: 0,
  emoji: '🔮',
  imageId: '1805',
  critRate: 35,
  critDamage: 75,
  agility: 35,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 4,
    effects: [],
  },
}
