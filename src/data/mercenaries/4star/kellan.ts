import type { MercenaryTemplate } from '../../../types/mercenary'

export const kellan: MercenaryTemplate = {
  id: 'kellan',
  name: '켈란',
  type: 'attacker',
  star: 4,
  maxHp: 4603,
  atk: 765,
  def: 5,
  emoji: '⚔️',
  imageId: '2855',
  critRate: 15,
  critDamage: 25,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [
      { type: 'crit_rate_up', value: 20, duration: 18, buffType: 'stat_enhance', target: 'self' },
      { type: 'char_type_buff', value: 1, debuffClass: 'stat_weaken' },
      { type: 'explosion', value: 2, debuffClass: 'dot', atkScaling: true },
      { type: 'crit_damage_up', value: 5, duration: 25, buffType: 'stat_enhance', target: 'self' },
      { type: 'equipment', value: 0, duration: 18, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
