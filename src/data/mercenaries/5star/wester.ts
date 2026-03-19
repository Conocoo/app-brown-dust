import type { MercenaryTemplate } from '../../../types/mercenary'

export const wester: MercenaryTemplate = {
  id: 'wester',
  name: '웨스터',
  type: 'mage',
  star: 5,
  maxHp: 5382,
  atk: 2006,
  def: 0,
  emoji: '🔮',
  imageId: '1195',
  critRate: 20,
  critDamage: 75,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'cross',
    rangeSize: 2,
    effects: [
      { type: 'revival', value: 0, duration: 36, buffType: 'special', target: 'self' },
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'insert_buff', value: 0, duration: 20, buffType: 'stat_enhance', target: 'self' },
      { type: 'shield', value: 50, duration: 18, debuffClass: 'stat_weaken' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
      { type: 'count_guard', value: 0, duration: 14, buffType: 'special', target: 'self' },
      { type: 'damage_limit', value: 0.41, duration: 14, buffType: 'special', target: 'self' },
    ],
  },
}
