import type { MercenaryTemplate } from '../../../types/mercenary'

export const krull: MercenaryTemplate = {
  id: 'krull',
  name: '크룰',
  type: 'attacker',
  star: 4,
  maxHp: 4794,
  atk: 909,
  def: 5,
  emoji: '⚔️',
  imageId: '2735',
  critRate: 10,
  critDamage: 50,
  agility: 5,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [
      { type: 'silence', value: 0, duration: 12, debuffClass: 'cc' },
      { type: 'char_type_buff', value: 2, debuffClass: 'stat_weaken' },
    ],
  },
}
