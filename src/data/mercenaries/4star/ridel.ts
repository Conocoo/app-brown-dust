import type { MercenaryTemplate } from '../../../types/mercenary'

export const ridel: MercenaryTemplate = {
  id: 'ridel',
  name: '리델',
  type: 'attacker',
  star: 4,
  maxHp: 3068,
  atk: 1039,
  def: 3,
  emoji: '⚔️',
  imageId: '1035',
  critRate: 10,
  critDamage: 50,
  agility: 10,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'back_n',
    rangeSize: 2,
    effects: [],
  },
}
