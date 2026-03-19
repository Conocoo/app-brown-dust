import type { MercenaryTemplate } from '../../../types/mercenary'

export const merry_white: MercenaryTemplate = {
  id: 'merry_white',
  name: '메리화이트',
  type: 'support',
  star: 5,
  maxHp: 5036,
  atk: 0,
  def: 10,
  emoji: '💚',
  imageId: '4575',
  critRate: 0,
  critDamage: 0,
  agility: 0,
  skill: {
    timing: 'passive',
    target: 'next_ally',
    attackRange: 'small_cross',
    rangeSize: 1,
    effects: [
      { type: 'on_attack_trigger', value: 0, duration: 1, buffType: 'stat_enhance' },
      { type: 'on_attack_trigger', value: 0, duration: 1, buffType: 'stat_enhance' },
      { type: 'char_type_buff', value: 1, buffType: 'stat_enhance' },
      { type: 'char_type_buff', value: 1, buffType: 'stat_enhance' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance' },
    ],
  },
}
