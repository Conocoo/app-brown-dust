import type { MercenaryTemplate } from '../../../types/mercenary'

export const arines: MercenaryTemplate = {
  id: 'arines',
  name: '아리네스',
  type: 'support',
  star: 3,
  maxHp: 2907,
  atk: 0,
  supportPower: 203,
  def: 5,
  emoji: '💚',
  imageId: '845',
  critRate: 0,
  critDamage: 0,
  agility: 5,
  skill: {
    timing: 'after_attack',
    target: 'next_ally',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [
      { type: 'atk_up', value: 45, duration: 6, buffType: 'stat_enhance' },
      { type: 'equipment', value: 0, duration: 8, buffType: 'stat_enhance' },
      { type: 'equipment', value: 0, duration: 8, buffType: 'stat_enhance' },
    ],
  },
}
