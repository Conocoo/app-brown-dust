import type { MercenaryTemplate } from '../../../types/mercenary'

export const susayra: MercenaryTemplate = {
  id: 'susayra',
  name: '서세이라',
  type: 'attacker',
  star: 5,
  maxHp: 4132,
  atk: 2928,
  def: 0,
  emoji: '⚔️',
  imageId: '4175',
  critRate: 40,
  critDamage: 25,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'back_n',
    rangeSize: 2,
    effects: [
      { type: 'char_type_buff', value: 1, buffType: 'stat_enhance', target: 'self' },
      { type: 'revival', value: 0, duration: 1, buffType: 'special', target: 'self' },
      { type: 'dot_31', value: 1, debuffClass: 'dot' },
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
