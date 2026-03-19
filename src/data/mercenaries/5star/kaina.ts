import type { MercenaryTemplate } from '../../../types/mercenary'

export const kaina: MercenaryTemplate = {
  id: 'kaina',
  name: '카이나',
  type: 'attacker',
  star: 5,
  maxHp: 4023,
  atk: 1237,
  def: 0,
  emoji: '⚔️',
  imageId: '3085',
  critRate: 10,
  critDamage: 50,
  agility: 25,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot_pierce', value: 0.4, debuffClass: 'dot', atkScaling: true },
      { type: 'char_type_buff', value: 3, debuffClass: 'stat_weaken' },
      { type: 'on_attack_trigger', value: 0, duration: 14, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
