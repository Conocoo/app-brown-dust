import type { MercenaryTemplate } from '../../../types/mercenary'

export const veronia: MercenaryTemplate = {
  id: 'veronia',
  name: '베로니아',
  type: 'support',
  star: 5,
  maxHp: 19591,
  atk: 0,
  def: 15,
  emoji: '💚',
  imageId: '2205',
  critRate: 0,
  critDamage: 0,
  agility: 10,
  skill: {
    timing: 'passive',
    target: 'next_ally',
    attackRange: 'single',
    effects: [
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance' },
      { type: 'atk_up', value: 75, duration: 16, buffType: 'stat_enhance' },
      { type: 'shield', value: 50, duration: 8, buffType: 'shield' },
    ],
  },
}
