import type { MercenaryTemplate } from '../../../types/mercenary'

export const lucrezia: MercenaryTemplate = {
  id: 'lucrezia',
  name: '루크레치아',
  type: 'mage',
  star: 4,
  maxHp: 2727,
  atk: 880,
  def: 0,
  emoji: '🔮',
  imageId: '1155',
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
