import type { MercenaryTemplate } from '../../../types/mercenary'

export const celia: MercenaryTemplate = {
  id: 'celia',
  name: '셀리아',
  type: 'mage',
  star: 5,
  maxHp: 8441,
  atk: 755,
  def: 0,
  emoji: '🔮',
  imageId: '1565',
  critRate: 25,
  critDamage: 75,
  agility: 35,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'area_n',
    rangeSize: 2,
    effects: [],
  },
}
