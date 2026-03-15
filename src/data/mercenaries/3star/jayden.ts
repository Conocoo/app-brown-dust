import type { MercenaryTemplate } from '../../../types/mercenary'

export const jayden: MercenaryTemplate = {
  id: 'jayden',
  name: '제이든',
  type: 'mage',
  star: 3,
  maxHp: 15039,
  atk: 1266,
  def: 10,
  emoji: '🔮',
  critRate: 25,
  critDamage: 75,
  agility: 0,
  skills: [
    { skillId: 'advanced_giant_strike' },
    { skillId: 'giant_strike_recovery' },
    { skillId: 'crit_rate_sustained_increase' },
    { skillId: 'regeneration' },
  ],
}
