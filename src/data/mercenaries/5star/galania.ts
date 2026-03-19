import type { MercenaryTemplate } from '../../../types/mercenary'

export const galania: MercenaryTemplate = {
  id: 'galania',
  name: '게일라니아',
  type: 'support',
  star: 5,
  maxHp: 2237,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '4185',
  critRate: 0,
  critDamage: 0,
  agility: 0,
  skill: {
    timing: 'passive',
    target: 'next_ally',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [
      { type: 'atk_up', value: 0, buffType: 'stat_enhance' },
      { type: 'atk_up', value: 20, duration: 28, buffType: 'stat_enhance' },
      { type: 'equipment', value: 0, duration: 28, buffType: 'stat_enhance' },
    ],
  },
}
