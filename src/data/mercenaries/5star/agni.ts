import type { MercenaryTemplate } from '../../../types/mercenary'

export const agni: MercenaryTemplate = {
  id: 'agni',
  name: '아그니',
  type: 'attacker',
  star: 5,
  maxHp: 3480,
  atk: 983,
  def: 5,
  emoji: '⚔️',
  imageId: '4565',
  critRate: 10,
  critDamage: 50,
  agility: 20,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [],
  },
}
