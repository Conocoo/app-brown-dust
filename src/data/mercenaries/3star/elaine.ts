import type { MercenaryTemplate } from '../../../types/mercenary'

export const elaine: MercenaryTemplate = {
  id: 'elaine',
  name: '일레인',
  type: 'mage',
  star: 3,
  maxHp: 2530,
  atk: 1665,
  def: 0,
  emoji: '🔮',
  imageId: '695',
  critRate: 15,
  critDamage: 50,
  agility: 5,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [],
  },
}
