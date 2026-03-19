import type { MercenaryTemplate } from '../../../types/mercenary'

export const delsahidne: MercenaryTemplate = {
  id: 'delsahidne',
  name: '델사히드네',
  type: 'support',
  star: 5,
  maxHp: 1812,
  atk: 0,
  def: 10,
  emoji: '💚',
  imageId: '4255',
  critRate: 0,
  critDamage: 0,
  agility: 0,
  skill: {
    timing: 'passive',
    target: 'next_ally',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [
      { type: 'char_type_buff', value: 4, buffType: 'stat_enhance' },
    ],
  },
}
