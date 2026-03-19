import type { MercenaryTemplate } from '../../../types/mercenary'

export const shion: MercenaryTemplate = {
  id: 'shion',
  name: 'シオン',
  type: 'attacker',
  star: 4,
  maxHp: 3837,
  atk: 1205,
  def: 0,
  emoji: '⚔️',
  imageId: '3995',
  critRate: 25,
  critDamage: 75,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'dot_variant', value: 0.01, duration: 4, debuffClass: 'dot' },
      { type: 'all_stats_down', value: 35, duration: 4, debuffClass: 'stat_weaken' },
      { type: 'agility_up', value: 40, duration: 6, buffType: 'stat_enhance', target: 'self' },
      { type: 'crit_rate_up', value: 50, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'atk_up', value: 50, duration: 999, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
