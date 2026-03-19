import type { MercenaryTemplate } from '../../../types/mercenary'

export const venomous_flower: MercenaryTemplate = {
  id: 'venomous_flower',
  name: '맹독화',
  type: 'support',
  star: 4,
  maxHp: 20596,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '8341',
  critRate: 0,
  critDamage: 0,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'next_ally',
    attackRange: 'area_n',
    rangeSize: 5,
    effects: [
      { type: 'taunt_immune', value: 0, duration: 32, buffType: 'stat_enhance' },
      { type: 'revival', value: 0, duration: 2, buffType: 'special' },
      { type: 'char_type_buff', value: 4, buffType: 'stat_enhance' },
    ],
  },
}
