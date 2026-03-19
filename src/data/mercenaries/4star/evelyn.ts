import type { MercenaryTemplate } from '../../../types/mercenary'

export const evelyn: MercenaryTemplate = {
  id: 'evelyn',
  name: '이블린',
  type: 'mage',
  star: 4,
  maxHp: 4028,
  atk: 567,
  def: 0,
  emoji: '🔮',
  imageId: '4465',
  critRate: 30,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [
      { type: 'equipment', value: 0, duration: 36, buffType: 'stat_enhance', target: 'self' },
      { type: 'def_up', value: 5, duration: 36, buffType: 'stat_enhance', target: 'self' },
      { type: 'all_stats_down', value: 45, duration: 8, debuffClass: 'stat_weaken' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
      { type: 'on_attack_trigger', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
