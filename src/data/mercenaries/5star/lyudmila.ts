import type { MercenaryTemplate } from '../../../types/mercenary'

export const lyudmila: MercenaryTemplate = {
  id: 'lyudmila',
  name: '류드밀라',
  type: 'attacker',
  star: 5,
  maxHp: 3046,
  atk: 118,
  def: 0,
  emoji: '⚔️',
  imageId: '4045',
  critRate: 70,
  critDamage: 75,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'front_n',
    rangeSize: 1,
    effects: [
      { type: 'stun', value: 0, duration: 12, debuffClass: 'cc' },
      { type: 'char_type_buff', value: 3, debuffClass: 'stat_weaken' },
      { type: 'dot_31', value: 1.5, debuffClass: 'dot' },
      { type: 'taunt_immune', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'insert_buff', value: 0, duration: 10, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
