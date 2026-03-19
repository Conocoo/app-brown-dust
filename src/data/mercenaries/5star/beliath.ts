import type { MercenaryTemplate } from '../../../types/mercenary'

export const beliath: MercenaryTemplate = {
  id: 'beliath',
  name: '벨리아스',
  type: 'support',
  star: 5,
  maxHp: 5505,
  atk: 0,
  def: 15,
  emoji: '💚',
  imageId: '2945',
  critRate: 20,
  critDamage: 50,
  agility: 35,
  skill: {
    timing: 'passive',
    target: 'next_ally',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [
      { type: 'revival', value: 0, buffType: 'special' },
      { type: 'atk_up', value: 30, duration: 12, buffType: 'stat_enhance' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance' },
      { type: 'shield', value: 70, duration: 999, buffType: 'shield' },
    ],
  },
}
