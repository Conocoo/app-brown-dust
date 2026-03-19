import type { MercenaryTemplate } from '../../../types/mercenary'

export const barbara: MercenaryTemplate = {
  id: 'barbara',
  name: '바바라',
  type: 'attacker',
  star: 5,
  maxHp: 5981,
  atk: 875,
  def: 0,
  emoji: '⚔️',
  imageId: '3045',
  critRate: 65,
  critDamage: 50,
  agility: 15,
  skill: {
    timing: 'before_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 3,
    effects: [
      { type: 'summon', value: 0, duration: 8, debuffClass: 'stat_weaken' },
      { type: 'dispel', value: 0, debuffClass: 'cc' },
      { type: 'insert_buff', value: 0, debuffClass: 'stat_weaken' },
      { type: 'insert_buff', value: 0, debuffClass: 'stat_weaken' },
      { type: 'damage_limit', value: 0.43, duration: 1, buffType: 'special', target: 'self' },
      { type: 'equipment', value: 0, duration: 1, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
