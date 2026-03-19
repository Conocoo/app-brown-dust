import type { MercenaryTemplate } from '../../../types/mercenary'

export const orphina: MercenaryTemplate = {
  id: 'orphina',
  name: '오르피나',
  type: 'defender',
  star: 5,
  maxHp: 13061,
  atk: 2204,
  def: 15,
  emoji: '🛡️',
  imageId: '4125',
  critRate: 25,
  critDamage: 50,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [
      { type: 'def_up', value: 30, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'crit_damage_up', value: 75, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'insert_buff', value: 0, debuffClass: 'stat_weaken' },
      { type: 'insert_buff', value: 0, debuffClass: 'stat_weaken' },
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
