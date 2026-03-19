import type { MercenaryTemplate } from '../../../types/mercenary'

export const evelyn: MercenaryTemplate = {
  id: 'evelyn',
  name: '이블린',
  type: 'mage',
  star: 4,
  maxHp: 4028,
  atk: 567,
  def: 0,
  emoji: '🔮',
  imageId: '4465',
  critRate: 30,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [],
  },
}
