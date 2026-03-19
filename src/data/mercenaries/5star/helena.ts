import type { MercenaryTemplate } from '../../../types/mercenary'

export const helena: MercenaryTemplate = {
  id: 'helena',
  name: '헬레나',
  type: 'support',
  star: 5,
  maxHp: 3776,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '345',
  critRate: 0,
  critDamage: 0,
  agility: 35,
  skill: {
    timing: 'passive',
    target: 'next_ally',
    attackRange: 'cross',
    rangeSize: 2,
    effects: [
      { type: 'char_type_buff', value: 4, buffType: 'stat_enhance' },
      { type: 'char_type_buff', value: 4, buffType: 'stat_enhance' },
    ],
  },
}
