import type { MercenaryTemplate } from '../../../types/mercenary'

export const dwen: MercenaryTemplate = {
  id: 'dwen',
  name: '드웬',
  type: 'attacker',
  star: 5,
  maxHp: 4566,
  atk: 1723,
  def: 38,
  emoji: '⚔️',
  imageId: '3005',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 2,
    effects: [],
  },
}
