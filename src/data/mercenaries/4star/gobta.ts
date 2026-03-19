import type { MercenaryTemplate } from '../../../types/mercenary'

export const gobta: MercenaryTemplate = {
  id: 'gobta',
  name: 'ゴブタ',
  type: 'defender',
  star: 4,
  maxHp: 5754,
  atk: 1008,
  def: 0,
  emoji: '🛡️',
  imageId: '3985',
  critRate: 10,
  critDamage: 50,
  agility: 40,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'single',
    effects: [
      { type: 'stun', value: 0, duration: 6, debuffClass: 'cc' },
      { type: 'def_down', value: 10, duration: 6, debuffClass: 'stat_weaken' },
      { type: 'added_buff_27', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'crit_rate_up', value: 50, duration: 999, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
