import type { MercenaryTemplate } from '../../../types/mercenary'

export const rafina: MercenaryTemplate = {
  id: 'rafina',
  name: '라피나',
  type: 'defender',
  star: 5,
  maxHp: 19591,
  atk: 2322,
  def: 30,
  emoji: '🛡️',
  imageId: '2185',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [],
  },
}
