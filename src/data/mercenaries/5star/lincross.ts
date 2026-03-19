import type { MercenaryTemplate } from '../../../types/mercenary'

export const lincross: MercenaryTemplate = {
  id: 'lincross',
  name: '링크로스',
  type: 'mage',
  star: 5,
  maxHp: 3667,
  atk: 2386,
  def: 10,
  emoji: '🔮',
  imageId: '4325',
  critRate: 20,
  critDamage: 50,
  agility: 5,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [],
  },
}
