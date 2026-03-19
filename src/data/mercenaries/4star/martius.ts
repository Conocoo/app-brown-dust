import type { MercenaryTemplate } from '../../../types/mercenary'

export const martius: MercenaryTemplate = {
  id: 'martius',
  name: '마티어스',
  type: 'defender',
  star: 4,
  maxHp: 5608,
  atk: 1023,
  def: 10,
  emoji: '🛡️',
  imageId: '3795',
  critRate: 20,
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
