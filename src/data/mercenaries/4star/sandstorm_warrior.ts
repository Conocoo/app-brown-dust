import type { MercenaryTemplate } from '../../../types/mercenary'

export const sandstorm_warrior: MercenaryTemplate = {
  id: 'sandstorm_warrior',
  name: '모래바람 전사',
  type: 'defender',
  star: 4,
  maxHp: 16716,
  atk: 4151,
  def: 10,
  emoji: '🛡️',
  imageId: '8802',
  critRate: 20,
  critDamage: 100,
  agility: 35,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [
      { type: 'shield', value: 25, duration: 6, debuffClass: 'stat_weaken' },
      { type: 'added_buff_27', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'damage_limit', value: 0.65, duration: 999, buffType: 'special', target: 'self' },
      { type: 'crit_damage_up', value: 10, duration: 30, buffType: 'stat_enhance', target: 'self' },
      { type: 'atk_up', value: 5, duration: 30, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
