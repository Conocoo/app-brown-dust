import type { MercenaryTemplate } from '../../../types/mercenary'

export const julie: MercenaryTemplate = {
  id: 'julie',
  name: '줄리',
  type: 'support',
  star: 3,
  maxHp: 2360,
  atk: 0,
  supportPower: 185.48,
  def: 0,
  emoji: '💚',
  critRate: 0,
  critDamage: 0,
  agility: 25,
  attackRange: 'area_n',
  rangeSize: 3,
  skills: [
    { skillId: 'advanced_cc_purify' },
    { skillId: 'advanced_regeneration_grant' },
    { skillId: 'reflex_grant' },
    { skillId: 'reflex_def_up' },
  ],
}
