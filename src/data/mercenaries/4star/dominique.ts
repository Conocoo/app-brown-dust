import type { MercenaryTemplate } from '../../../types/mercenary'

export const dominique: MercenaryTemplate = {
  id: 'dominique',
  name: '도미니크',
  type: 'attacker',
  star: 4,
  maxHp: 4794,
  atk: 985,
  def: 5,
  emoji: '⚔️',
  imageId: '995',
  critRate: 10,
  critDamage: 50,
  agility: 20,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'single',
    effects: [],
  },
}
