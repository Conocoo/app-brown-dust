import type { MercenaryTemplate } from '../../../types/mercenary'

export const sui: MercenaryTemplate = {
  id: 'sui',
  name: '스이',
  type: 'support',
  star: 4,
  maxHp: 4906,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '4165',
  critRate: 0,
  critDamage: 0,
  agility: 10,
  skill: {
    timing: 'after_attack',
    target: 'next_ally',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [
      { type: 'regeneration', value: 2, duration: 16, buffType: 'stat_enhance' },
      { type: 'crit_rate_up', value: 10, duration: 16, buffType: 'stat_enhance' },
      { type: 'equipment', value: 0, duration: 8, buffType: 'stat_enhance' },
    ],
  },
}
