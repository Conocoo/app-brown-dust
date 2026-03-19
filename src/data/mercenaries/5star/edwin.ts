import type { MercenaryTemplate } from '../../../types/mercenary'

export const edwin: MercenaryTemplate = {
  id: 'edwin',
  name: '에드윈',
  type: 'mage',
  star: 5,
  maxHp: 6195,
  atk: 960,
  def: 10,
  emoji: '🔮',
  imageId: '3565',
  critRate: 20,
  critDamage: 50,
  agility: 35,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'cross',
    rangeSize: 2,
    effects: [],
  },
}
