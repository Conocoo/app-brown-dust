import type { MercenaryTemplate } from '../../../types/mercenary'

export const naressa: MercenaryTemplate = {
  id: 'naressa',
  name: '나레사',
  type: 'support',
  star: 4,
  maxHp: 3078,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '3805',
  critRate: 0,
  critDamage: 0,
  agility: 25,
  skill: {
    timing: 'after_attack',
    target: 'next_ally',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [
      { type: 'agility_up', value: 10, duration: 10, buffType: 'stat_enhance' },
      { type: 'crit_damage_up', value: 15, duration: 10, buffType: 'stat_enhance' },
      { type: 'regeneration', value: 15, buffType: 'stat_enhance' },
    ],
  },
}
