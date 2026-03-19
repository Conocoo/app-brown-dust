import type { MercenaryTemplate } from '../../../types/mercenary'

export const demon_lord_geld: MercenaryTemplate = {
  id: 'demon_lord_geld',
  name: 'オークディザスター',
  type: 'mage',
  star: 5,
  maxHp: 5685,
  atk: 1134,
  def: 0,
  emoji: '🔮',
  imageId: '9508',
  critRate: 25,
  critDamage: 75,
  agility: 0,
  skill: {
    timing: 'passive',
    target: 'enemy_back',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [],
  },
}
