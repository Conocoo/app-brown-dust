import type { MercenaryTemplate } from '../../../types/mercenary'

export const brisa: MercenaryTemplate = {
  id: 'brisa',
  name: '브리사',
  type: 'attacker',
  star: 4,
  maxHp: 4989,
  atk: 1862,
  def: 0,
  emoji: '⚔️',
  imageId: '2395',
  critRate: 10,
  critDamage: 50,
  agility: 40,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [],
  },
}
