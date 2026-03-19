import type { MercenaryTemplate } from '../../../types/mercenary'

export const rogan: MercenaryTemplate = {
  id: 'rogan',
  name: '로건',
  type: 'attacker',
  star: 5,
  maxHp: 8705,
  atk: 1490,
  def: 5,
  emoji: '⚔️',
  imageId: '1365',
  critRate: 35,
  critDamage: 75,
  agility: 5,
  skill: {
    timing: 'passive',
    target: 'enemy_front',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [],
  },
}
