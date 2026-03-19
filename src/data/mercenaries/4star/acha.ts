import type { MercenaryTemplate } from '../../../types/mercenary'

export const acha: MercenaryTemplate = {
  id: 'acha',
  name: '아챠',
  type: 'defender',
  star: 4,
  maxHp: 5464,
  atk: 979,
  def: 10,
  emoji: '🛡️',
  imageId: '3545',
  critRate: 20,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'single',
    effects: [
      { type: 'added_buff_27', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'def_up', value: 15, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'crit_rate_up', value: 50, duration: 6, buffType: 'stat_enhance', target: 'self' },
      { type: 'crit_damage_up', value: 50, duration: 6, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot', value: 0.4, duration: 6, debuffClass: 'dot', atkScaling: true },
    ],
  },
}
