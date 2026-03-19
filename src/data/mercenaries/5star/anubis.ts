import type { MercenaryTemplate } from '../../../types/mercenary'

export const anubis: MercenaryTemplate = {
  id: 'anubis',
  name: '아누비스',
  type: 'mage',
  star: 5,
  maxHp: 8804,
  atk: 1424,
  def: 0,
  emoji: '🔮',
  imageId: '1515',
  critRate: 20,
  critDamage: 50,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'small_cross',
    rangeSize: 1,
    effects: [
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'all_stats_down', value: 10, duration: 12, debuffClass: 'stat_weaken' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
      { type: 'turn_pass', value: 0, duration: 9, debuffClass: 'stat_weaken' },
      { type: 'count_guard', value: 0, duration: 30, buffType: 'special', target: 'self' },
      { type: 'added_buff_25', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
