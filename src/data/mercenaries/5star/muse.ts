import type { MercenaryTemplate } from '../../../types/mercenary'

export const muse: MercenaryTemplate = {
  id: 'muse',
  name: '뮤즈',
  type: 'mage',
  star: 5,
  maxHp: 1954,
  atk: 3102,
  def: 0,
  emoji: '🔮',
  imageId: '4355',
  critRate: 25,
  critDamage: 75,
  agility: 10,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'x_shape',
    rangeSize: 1,
    effects: [
      { type: 'shield', value: 35, duration: 40, debuffClass: 'stat_weaken' },
      { type: 'insert_buff', value: 0, debuffClass: 'stat_weaken' },
      { type: 'def_up', value: 35, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'crit_rate_up', value: 30, duration: 100, buffType: 'stat_enhance', target: 'self' },
      { type: 'crit_damage_up', value: 50, duration: 100, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
