import type { MercenaryTemplate } from '../../../types/mercenary'

export const kiria: MercenaryTemplate = {
  id: 'kiria',
  name: '키리아',
  type: 'attacker',
  star: 5,
  maxHp: 4872,
  atk: 1322,
  def: 0,
  emoji: '⚔️',
  imageId: '4005',
  critRate: 10,
  critDamage: 50,
  agility: 50,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [],
  },
}
