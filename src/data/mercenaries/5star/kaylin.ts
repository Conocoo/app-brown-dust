import type { MercenaryTemplate } from '../../../types/mercenary'

export const kaylin: MercenaryTemplate = {
  id: 'kaylin',
  name: '케일런',
  type: 'defender',
  star: 5,
  maxHp: 6530,
  atk: 342,
  def: 10,
  emoji: '🛡️',
  imageId: '3505',
  critRate: 20,
  critDamage: 75,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [
      { type: 'insert_buff', value: 0, debuffClass: 'stat_weaken' },
      { type: 'insert_buff', value: 0, debuffClass: 'stat_weaken' },
      { type: 'counter_attack', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot_31', value: 0.15, debuffClass: 'dot' },
    ],
  },
}
