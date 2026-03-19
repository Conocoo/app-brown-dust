import type { MercenaryTemplate } from '../../../types/mercenary'

export const corrupted_assassin: MercenaryTemplate = {
  id: 'corrupted_assassin',
  name: '타락한 암살자',
  type: 'attacker',
  star: 4,
  maxHp: 6965,
  atk: 5703,
  def: 10,
  emoji: '⚔️',
  imageId: '8806',
  critRate: 20,
  critDamage: 100,
  agility: 35,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'front_n',
    rangeSize: 1,
    effects: [
      { type: 'dot_30', value: 1, debuffClass: 'dot' },
      { type: 'all_stats_down', value: 25, duration: 8, debuffClass: 'stat_weaken' },
      { type: 'taunt_immune', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'crit_damage_up', value: 10, duration: 30, buffType: 'stat_enhance', target: 'self' },
      { type: 'atk_up', value: 5, duration: 30, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
