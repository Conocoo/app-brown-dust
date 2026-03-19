import type { MercenaryTemplate } from '../../../types/mercenary'

export const eindolin: MercenaryTemplate = {
  id: 'eindolin',
  name: '아인돌린',
  type: 'support',
  star: 5,
  maxHp: 4194,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '3855',
  critRate: 0,
  critDamage: 0,
  agility: 0,
  skill: {
    timing: 'passive',
    target: 'next_ally',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [
      { type: 'equipment', value: 0, duration: 24, buffType: 'stat_enhance' },
    ],
  },
}
