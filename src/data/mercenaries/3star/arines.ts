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
  attackRange: 'cross',
  rangeSize: 1,
  skills: [
    { skillId: 'fair_and_square' },
    { skillId: 'advanced_atk_up' },
    { skillId: 'cc_immune' },
    { skillId: 'stat_debuff_immune_grant' },
  ],
}
