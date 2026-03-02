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
  imageId: '675',
  critRate: 7.5,
  critDamage: 75,
  agility: 0,
  attackRange: 'back_n',
  rangeSize: 2,
  skills: [
    { skillId: 'advanced_burn', effects: [{ value: 25, duration: 5, dmgTakenUp: 20 }] },
    { skillId: 'advanced_fatal_strike', effects: [{ value: 50 }, { value: 50 }] },
    { skillId: 'shield', effects: [{ value: 25, duration: 12 }] },
  ],
}
