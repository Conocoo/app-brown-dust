import type { MercenaryTemplate } from '../../../types/mercenary'

export const granhildr: MercenaryTemplate = {
  id: 'granhildr',
  name: '그란힐트',
  type: 'defender',
  star: 5,
  maxHp: 25692,
  atk: 1118,
  def: 20,
  emoji: '🛡️',
  imageId: '1785',
  critRate: 10,
  critDamage: 50,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [],
  },
}
