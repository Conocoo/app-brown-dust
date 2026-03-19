import type { MercenaryTemplate } from '../../../types/mercenary'

export const magnus: MercenaryTemplate = {
  id: 'magnus',
  name: '마그누스',
  type: 'mage',
  star: 4,
  maxHp: 3046,
  atk: 1556,
  def: 0,
  emoji: '🔮',
  imageId: '1425',
  critRate: 20,
  critDamage: 75,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'cross',
    rangeSize: 2,
    effects: [
      { type: 'dispel', value: 0, debuffClass: 'cc' },
      { type: 'atk_down', value: 30, duration: 18, debuffClass: 'stat_weaken' },
      { type: 'silence', value: 0, duration: 18, debuffClass: 'cc' },
    ],
  },
}
