import type { MercenaryTemplate } from '../../../types/mercenary'

export const maria: MercenaryTemplate = {
  id: 'maria',
  name: '마리아',
  type: 'mage',
  star: 3,
  maxHp: 3630,
  atk: 2626,
  def: 0,
  emoji: '🔮',
  imageId: '835',
  critRate: 35,
  critDamage: 75,
  agility: 15,
  attackRange: 'back_n',
  rangeSize: 3,
  skills: [
    { skillId: 'dispel_skill' },
    { skillId: 'supreme_fatal_strike', effects: [{ value: 200 }] },
    { skillId: 'recovery' },
    { skillId: 'on_kill_atk_up', effects: [{ value: 100, duration: 24 }] },
    { skillId: 'curse_skill' },
  ],
}
