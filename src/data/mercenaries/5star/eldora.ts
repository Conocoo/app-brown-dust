import type { MercenaryTemplate } from '../../../types/mercenary'

export const eldora: MercenaryTemplate = {
  id: 'eldora',
  name: '엘도라',
  type: 'mage',
  star: 5,
  maxHp: 3730,
  atk: 6879,
  def: 0,
  emoji: '🔮',
  imageId: '2725',
  critRate: 20,
  critDamage: 100,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'front_n',
    rangeSize: 3,
    effects: [],
  },
}
