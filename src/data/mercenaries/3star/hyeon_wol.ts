import type { MercenaryTemplate } from '../../../types/mercenary'

export const hyeon_wol: MercenaryTemplate = {
  id: 'hyeon_wol',
  name: '현월',
  type: 'support',
  star: 3,
  maxHp: 2468,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '3115',
  critRate: 0,
  critDamage: 0,
  agility: 10,
  skill: {
    timing: 'after_attack',
    target: 'next_ally',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [
      { type: 'crit_damage_up', value: 24, duration: 12, buffType: 'stat_enhance' },
      { type: 'dispel', value: 0, buffType: 'stat_enhance' },
    ],
  },
}
