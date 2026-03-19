import type { MercenaryTemplate } from '../../../types/mercenary'

export const rafina: MercenaryTemplate = {
  id: 'rafina',
  name: '라피나',
  type: 'defender',
  star: 5,
  maxHp: 19591,
  atk: 2322,
  def: 30,
  emoji: '🛡️',
  imageId: '2185',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [
      { type: 'damage_limit', value: 0.32, duration: 8, buffType: 'special', target: 'self' },
      { type: 'shield', value: 0, duration: 8, buffType: 'shield', target: 'self' },
      { type: 'insert_buff', value: 0, debuffClass: 'stat_weaken' },
      { type: 'stun', value: 0, duration: 4, debuffClass: 'cc' },
      { type: 'taunt_immune', value: 0, duration: 6, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
