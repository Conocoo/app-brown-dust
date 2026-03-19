import type { MercenaryTemplate } from '../../../types/mercenary'

export const elis: MercenaryTemplate = {
  id: 'elis',
  name: '엘리제',
  type: 'mage',
  star: 5,
  maxHp: 6376,
  atk: 2299,
  def: 0,
  emoji: '🔮',
  imageId: '1145',
  critRate: 35,
  critDamage: 75,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [
      { type: 'charm', value: 0, duration: 12, debuffClass: 'cc' },
      { type: 'position_change', value: 0, duration: 12, debuffClass: 'cc' },
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
