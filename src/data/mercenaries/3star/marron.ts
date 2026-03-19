import type { MercenaryTemplate } from '../../../types/mercenary'

export const marron: MercenaryTemplate = {
  id: 'marron',
  name: '마론',
  type: 'attacker',
  star: 3,
  maxHp: 4013,
  atk: 444,
  def: 10,
  emoji: '⚔️',
  imageId: '3145',
  critRate: 5,
  critDamage: 25,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [
      { type: 'silence', value: 0, duration: 12, debuffClass: 'cc' },
      { type: 'all_stats_down', value: 25, duration: 18, debuffClass: 'stat_weaken' },
      { type: 'position_change', value: 0, duration: 18, debuffClass: 'cc' },
      { type: 'range_reduce', value: 0, duration: 18, debuffClass: 'cc' },
    ],
  },
}
