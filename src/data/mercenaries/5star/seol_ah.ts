import type { MercenaryTemplate } from '../../../types/mercenary'

export const seol_ah: MercenaryTemplate = {
  id: 'seol_ah',
  name: '설아',
  type: 'support',
  star: 5,
  maxHp: 3776,
  atk: 0,
  def: 3,
  emoji: '💚',
  imageId: '4145',
  critRate: 0,
  critDamage: 0,
  agility: 30,
  skill: {
    timing: 'passive',
    target: 'next_ally',
    attackRange: 'single',
    effects: [
      { type: 'crit_rate_up', value: 10, duration: 6, buffType: 'stat_enhance' },
      { type: 'crit_damage_up', value: 15, duration: 6, buffType: 'stat_enhance' },
      { type: 'equipment', value: 0, duration: 6, buffType: 'stat_enhance' },
    ],
  },
}
