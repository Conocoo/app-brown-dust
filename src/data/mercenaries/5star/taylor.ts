import type { MercenaryTemplate } from '../../../types/mercenary'

export const taylor: MercenaryTemplate = {
  id: 'taylor',
  name: '테일러',
  type: 'attacker',
  star: 5,
  maxHp: 4352,
  atk: 3391,
  def: 10,
  emoji: '⚔️',
  imageId: '3875',
  critRate: 65,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'x_shape',
    rangeSize: 1,
    effects: [
      { type: 'direct_damage', value: 2, debuffClass: 'stat_weaken' },
      { type: 'stun', value: 0, duration: 18, debuffClass: 'cc' },
      { type: 'hp_up', value: 3500, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
