import type { MercenaryTemplate } from '../../../types/mercenary'

export const pyran: MercenaryTemplate = {
  id: 'pyran',
  name: '파이란',
  type: 'defender',
  star: 5,
  maxHp: 17380,
  atk: 2303,
  def: 50,
  emoji: '🛡️',
  imageId: '7015',
  critRate: 20,
  critDamage: 50,
  agility: 10,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [],
  },
}
