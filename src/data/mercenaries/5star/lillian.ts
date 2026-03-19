import type { MercenaryTemplate } from '../../../types/mercenary'

export const lillian: MercenaryTemplate = {
  id: 'lillian',
  name: '릴리안',
  type: 'mage',
  star: 5,
  maxHp: 3260,
  atk: 4826,
  def: 0,
  emoji: '🔮',
  imageId: '3345',
  critRate: 20,
  critDamage: 75,
  agility: 0,
  skill: {
    timing: 'passive',
    target: 'enemy_front',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [],
  },
}
