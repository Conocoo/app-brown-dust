import type { MercenaryTemplate } from '../../../types/mercenary'

export const lulu: MercenaryTemplate = {
  id: 'lulu',
  name: '루루',
  type: 'support',
  star: 4,
  maxHp: 4931,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '4055',
  critRate: 0,
  critDamage: 0,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'next_ally',
    attackRange: 'x_shape',
    rangeSize: 1,
    effects: [
      { type: 'added_buff_27', value: 0, duration: 16, buffType: 'stat_enhance' },
      { type: 'regeneration', value: 10, duration: 5, buffType: 'stat_enhance' },
    ],
  },
}
