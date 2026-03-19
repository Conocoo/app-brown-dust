import type { MercenaryTemplate } from '../../../types/mercenary'

export const ceres: MercenaryTemplate = {
  id: 'ceres',
  name: '세레스',
  type: 'support',
  star: 4,
  maxHp: 2832,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '3075',
  critRate: 0,
  critDamage: 0,
  agility: 50,
  skill: {
    timing: 'after_attack',
    target: 'next_ally',
    attackRange: 'front_n',
    rangeSize: 3,
    effects: [
      { type: 'equipment', value: 0, duration: 12, buffType: 'stat_enhance' },
      { type: 'dispel', value: 0, buffType: 'stat_enhance' },
    ],
  },
}
