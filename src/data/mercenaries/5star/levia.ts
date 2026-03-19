import type { MercenaryTemplate } from '../../../types/mercenary'

export const levia: MercenaryTemplate = {
  id: 'levia',
  name: '레비아',
  type: 'mage',
  star: 5,
  maxHp: 5400,
  atk: 5434,
  def: 100,
  emoji: '🔮',
  imageId: '2955',
  critRate: 20,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [],
  },
}
