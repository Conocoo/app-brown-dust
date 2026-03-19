import type { MercenaryTemplate } from '../../../types/mercenary'

export const yuri: MercenaryTemplate = {
  id: 'yuri',
  name: '유리',
  type: 'attacker',
  star: 5,
  maxHp: 5004,
  atk: 2148,
  def: 0,
  emoji: '⚔️',
  imageId: '3535',
  critRate: 40,
  critDamage: 75,
  agility: 75,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'x_shape',
    rangeSize: 1,
    effects: [],
  },
}
