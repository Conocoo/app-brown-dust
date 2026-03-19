import type { MercenaryTemplate } from '../../../types/mercenary'

export const asmode: MercenaryTemplate = {
  id: 'asmode',
  name: '아스모드',
  type: 'support',
  star: 5,
  maxHp: 5505,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '2905',
  critRate: 20,
  critDamage: 50,
  agility: 65,
  skill: {
    timing: 'passive',
    target: 'next_ally',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [
      { type: 'char_type_buff', value: 1, debuffClass: 'stat_weaken' },
      { type: 'dot_pierce', value: 0.6, debuffClass: 'dot' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance' },
    ],
  },
}
