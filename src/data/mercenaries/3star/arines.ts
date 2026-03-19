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
      { type: 'temp_hp', value: 100, spScaling: true, duration: 16, buffType: 'stat_enhance', linkedBuffId: 'atk_up' },
      { type: 'atk_up', value: 85, spScaling: true, duration: 16, buffType: 'stat_enhance' },
      { type: 'atk_up', value: 85, spScaling: true, duration: 12, buffType: 'stat_enhance' },
      { type: 'crit_up', value: 20, spScaling: true, duration: 12, buffType: 'stat_enhance' },
      { type: 'cc_immune', value: 0, duration: 8, buffType: 'special', target: 'self' },
      { type: 'stat_debuff_immune', value: 0, duration: 8, buffType: 'special' },
    ],
  },
}
