import type { MercenaryTemplate } from '../../../types/mercenary'

export const sloan: MercenaryTemplate = {
  id: 'sloan',
  name: '슬론',
  type: 'defender',
  star: 3,
  maxHp: 5574,
  atk: 896,
  def: 10,
  emoji: '🛡️',
  critRate: 5,
  critDamage: 50,
  agility: 0,
  skills: [
    { skillId: 'advanced_poison_counter' },
    { skillId: 'poison' },
    { skillId: 'advanced_shield' },
    { skillId: 'decay' },
    { skillId: 'sloan_recovery' },
  ],
}
