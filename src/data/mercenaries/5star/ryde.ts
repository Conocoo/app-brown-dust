import type { MercenaryTemplate } from '../../../types/mercenary'

export const ryde: MercenaryTemplate = {
  id: 'ryde',
  name: '라이데',
  type: 'support',
  star: 5,
  maxHp: 7123,
  atk: 0,
  def: 15,
  emoji: '💚',
  imageId: '7035',
  critRate: 20,
  critDamage: 50,
  agility: 15,
  skill: {
    timing: 'passive',
    target: 'next_ally',
    attackRange: 'area_n',
    rangeSize: 2,
    effects: [
      { type: 'added_buff_27', value: 0, duration: 20, buffType: 'stat_enhance' },
      { type: 'shield', value: 50, duration: 20, buffType: 'shield' },
      { type: 'on_attack_trigger', value: 0, duration: 2, buffType: 'stat_enhance' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance' },
      { type: 'atk_up', value: 170, duration: 34, buffType: 'stat_enhance' },
    ],
  },
}
