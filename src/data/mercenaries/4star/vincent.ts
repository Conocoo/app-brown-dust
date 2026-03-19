import type { MercenaryTemplate } from '../../../types/mercenary'

export const vincent: MercenaryTemplate = {
  id: 'vincent',
  name: '빈센트',
  type: 'support',
  star: 4,
  maxHp: 3020,
  atk: 0,
  def: 5,
  emoji: '💚',
  imageId: '2985',
  critRate: 0,
  critDamage: 0,
  agility: 5,
  skill: {
    timing: 'after_attack',
    target: 'next_ally',
    attackRange: 'horizontal',
    rangeSize: 3,
    effects: [
      { type: 'shield', value: 10, duration: 10, buffType: 'shield' },
      { type: 'dispel', value: 0, buffType: 'stat_enhance' },
    ],
  },
}
