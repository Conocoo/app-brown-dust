import type { MercenaryTemplate } from '../../../types/mercenary'

export const themis: MercenaryTemplate = {
  id: 'themis',
  name: '테미스',
  type: 'support',
  star: 5,
  maxHp: 7553,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '3415',
  critRate: 0,
  critDamage: 0,
  agility: 20,
  skill: {
    timing: 'after_attack',
    target: 'next_ally',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [
      { type: 'added_buff_27', value: 0, duration: 6, buffType: 'stat_enhance' },
      { type: 'crit_rate_up', value: 10, duration: 10, buffType: 'stat_enhance' },
    ],
  },
}
