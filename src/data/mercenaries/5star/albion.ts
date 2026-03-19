import type { MercenaryTemplate } from '../../../types/mercenary'

export const albion: MercenaryTemplate = {
  id: 'albion',
  name: '알비온',
  type: 'support',
  star: 5,
  maxHp: 9791,
  atk: 0,
  def: 5,
  emoji: '💚',
  imageId: '4065',
  critRate: 0,
  critDamage: 0,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'next_ally',
    attackRange: 'x_shape',
    rangeSize: 1,
    effects: [
      { type: 'char_type_buff', value: 4, buffType: 'stat_enhance' },
      { type: 'agility_up', value: 30, duration: 14, buffType: 'stat_enhance' },
      { type: 'shield', value: 10, duration: 14, buffType: 'shield' },
      { type: 'taunt', value: 0, duration: 12, buffType: 'stat_enhance' },
    ],
  },
}
