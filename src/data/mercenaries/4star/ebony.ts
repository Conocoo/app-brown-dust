import type { MercenaryTemplate } from '../../../types/mercenary'

export const ebony: MercenaryTemplate = {
  id: 'ebony',
  name: '에보니',
  type: 'support',
  star: 4,
  maxHp: 2711,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '2795',
  critRate: 0,
  critDamage: 0,
  agility: 5,
  skill: {
    timing: 'after_attack',
    target: 'next_ally',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [
      { type: 'atk_up', value: 10, duration: 10, buffType: 'stat_enhance' },
      { type: 'equipment', value: 0, duration: 12, buffType: 'stat_enhance' },
    ],
  },
}
