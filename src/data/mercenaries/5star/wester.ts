import type { MercenaryTemplate } from '../../../types/mercenary'

export const wester: MercenaryTemplate = {
  id: 'wester',
  name: '웨스터',
  type: 'mage',
  star: 5,
  maxHp: 5382,
  atk: 2006,
  def: 0,
  emoji: '🔮',
  imageId: '1195',
  critRate: 20,
  critDamage: 75,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'cross',
    rangeSize: 2,
    effects: [],
  },
}
