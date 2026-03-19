import type { MercenaryTemplate } from '../../../types/mercenary'

export const benshina: MercenaryTemplate = {
  id: 'benshina',
  name: '밴시나',
  type: 'defender',
  star: 5,
  maxHp: 26122,
  atk: 963,
  def: 10,
  emoji: '🛡️',
  imageId: '4025',
  critRate: 20,
  critDamage: 0,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'back_n',
    rangeSize: 1,
    effects: [],
  },
}
