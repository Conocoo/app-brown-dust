import type { MercenaryTemplate } from '../../../types/mercenary'

export const isaac: MercenaryTemplate = {
  id: 'isaac',
  name: '아이작',
  type: 'defender',
  star: 5,
  maxHp: 25987,
  atk: 552,
  def: 0,
  emoji: '🛡️',
  imageId: '4275',
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
