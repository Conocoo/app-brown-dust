import type { MercenaryTemplate } from '../../../types/mercenary'

export const sarubia: MercenaryTemplate = {
  id: 'sarubia',
  name: '사루비아',
  type: 'support',
  star: 4,
  maxHp: 2587,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '3575',
  critRate: 0,
  critDamage: 0,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'next_ally',
    attackRange: 'single',
    effects: [],
  },
}
