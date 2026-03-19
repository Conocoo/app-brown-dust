import type { MercenaryTemplate } from '../../../types/mercenary'

export const serendia: MercenaryTemplate = {
  id: 'serendia',
  name: '세렌디아',
  type: 'support',
  star: 4,
  maxHp: 3700,
  atk: 0,
  def: 5,
  emoji: '💚',
  imageId: '2715',
  critRate: 0,
  critDamage: 0,
  agility: 15,
  skill: {
    timing: 'passive',
    target: 'next_ally',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [
      { type: 'atk_up', value: 30, duration: 10, buffType: 'stat_enhance' },
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance' },
    ],
  },
}
