import type { MercenaryTemplate } from '../../../types/mercenary'

export const cordelia: MercenaryTemplate = {
  id: 'cordelia',
  name: '코델리아',
  type: 'attacker',
  star: 3,
  maxHp: 2941,
  atk: 849,
  def: 3,
  emoji: '⚔️',
  imageId: '1014',
  critRate: 7.5,
  critDamage: 75,
  agility: 0,
  attackRange: 'back_n',
  rangeSize: 2,
  skillIds: ['advanced_burn', 'advanced_fatal_strike', 'shield'],
}
