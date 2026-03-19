import type { MercenaryTemplate } from '../../../types/mercenary'

export const ledakrad: MercenaryTemplate = {
  id: 'ledakrad',
  name: '레다크라드',
  type: 'defender',
  star: 5,
  maxHp: 4217,
  atk: 1471,
  def: 15,
  emoji: '🛡️',
  imageId: '4245',
  critRate: 10,
  critDamage: 50,
  agility: 30,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'front_n',
    rangeSize: 1,
    effects: [
      { type: 'char_type_buff', value: 2, buffType: 'stat_enhance', target: 'self' },
      { type: 'hp_up', value: 0.6, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'revival', value: 0, buffType: 'special', target: 'self' },
      { type: 'dot_31', value: 0.25, debuffClass: 'dot' },
    ],
  },
}
