import type { MercenaryTemplate } from '../../../types/mercenary'

export const maya: MercenaryTemplate = {
  id: 'maya',
  name: '마야',
  type: 'attacker',
  star: 4,
  maxHp: 4794,
  atk: 925,
  def: 5,
  emoji: '⚔️',
  imageId: '925',
  critRate: 10,
  critDamage: 50,
  agility: 20,
  attackTarget: 'enemy_second',
  attackRange: 'single',
  skills: [
    { skillId: 'advanced_focus_fire' },
    { skillId: 'taunt_immune' },
    { skillId: 'advanced_dispel' },
    { skillId: 'atk_weaken' },
  ],
}
