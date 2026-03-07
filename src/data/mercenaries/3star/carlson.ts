import type { MercenaryTemplate } from '../../../types/mercenary'

export const carlson: MercenaryTemplate = {
  id: 'carlson',
  name: '칼슨',
  type: 'defender',
  star: 3,
  maxHp: 6798,
  atk: 874,
  def: 12,
  emoji: '🛡️',
  imageId: '825',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skills: [
    { skillId: 'advanced_taunt' },
    { skillId: 'advanced_armor_strike' },
    { skillId: 'recovery' },
    { skillId: 'advanced_dot_immune' },
  ],
}
