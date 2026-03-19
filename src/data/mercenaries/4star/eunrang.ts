import type { MercenaryTemplate } from '../../../types/mercenary'

export const eunrang: MercenaryTemplate = {
  id: 'eunrang',
  name: '은랑',
  type: 'attacker',
  star: 4,
  maxHp: 3642,
  atk: 382,
  def: 0,
  emoji: '⚔️',
  imageId: '2835',
  critRate: 10,
  critDamage: 50,
  agility: 65,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'front_n',
    rangeSize: 1,
    effects: [],
  },
}
