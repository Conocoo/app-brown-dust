import type { MercenaryTemplate } from '../../../types/mercenary'

export const corrupted_knight: MercenaryTemplate = {
  id: 'corrupted_knight',
  name: '타락한 기사',
  type: 'defender',
  star: 4,
  maxHp: 16716,
  atk: 3094,
  def: 10,
  emoji: '🛡️',
  imageId: '8805',
  critRate: 20,
  critDamage: 100,
  agility: 35,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [
      { type: 'dot_30', value: 1, debuffClass: 'dot' },
      { type: 'all_stats_down', value: 25, duration: 8, debuffClass: 'stat_weaken' },
      { type: 'range_shrink', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'taunt', value: 0, duration: 6, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
