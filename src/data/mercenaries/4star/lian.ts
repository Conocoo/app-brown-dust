import type { MercenaryTemplate } from '../../../types/mercenary'

export const lian: MercenaryTemplate = {
  id: 'lian',
  name: '라이언',
  type: 'attacker',
  star: 4,
  maxHp: 2338,
  atk: 2488,
  def: 0,
  emoji: '⚔️',
  imageId: '3835',
  critRate: 20,
  critDamage: 75,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'x_shape',
    rangeSize: 1,
    effects: [],
  },
}
