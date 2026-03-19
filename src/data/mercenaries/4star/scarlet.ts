import type { MercenaryTemplate } from '../../../types/mercenary'

export const scarlet: MercenaryTemplate = {
  id: 'scarlet',
  name: '스칼렛',
  type: 'attacker',
  star: 4,
  maxHp: 3837,
  atk: 909,
  def: 5,
  emoji: '⚔️',
  imageId: '4115',
  critRate: 35,
  critDamage: 75,
  agility: 65,
  skill: {
    timing: 'before_attack',
    target: 'enemy_front',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [],
  },
}
