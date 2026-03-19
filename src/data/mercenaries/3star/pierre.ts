import type { MercenaryTemplate } from '../../../types/mercenary'

export const pierre: MercenaryTemplate = {
  id: 'pierre',
  name: '피에르',
  type: 'mage',
  star: 3,
  maxHp: 3003,
  atk: 2113,
  def: 5,
  emoji: '🔮',
  imageId: '375',
  critRate: 15,
  critDamage: 75,
  agility: 5,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [
      { type: 'stun', value: 0, duration: 12, debuffClass: 'cc' },
      { type: 'all_stats_down', value: 30, duration: 16, debuffClass: 'stat_weaken' },
      { type: 'dot', value: 1, debuffClass: 'dot', atkScaling: true },
    ],
  },
}
