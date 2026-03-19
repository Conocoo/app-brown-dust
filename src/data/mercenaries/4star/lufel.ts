import type { MercenaryTemplate } from '../../../types/mercenary'

export const lufel: MercenaryTemplate = {
  id: 'lufel',
  name: '루펠',
  type: 'mage',
  star: 4,
  maxHp: 3020,
  atk: 1945,
  def: 0,
  emoji: '🔮',
  imageId: '2745',
  critRate: 0,
  critDamage: 50,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'back_n',
    rangeSize: 2,
    effects: [],
  },
}
