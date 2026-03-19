import type { MercenaryTemplate } from '../../../types/mercenary'

export const bellasier: MercenaryTemplate = {
  id: 'bellasier',
  name: '벨라시에',
  type: 'defender',
  star: 4,
  maxHp: 8919,
  atk: 405,
  def: 10,
  emoji: '🛡️',
  imageId: '3945',
  critRate: 65,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'passive',
    target: 'enemy_back',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [],
  },
}
