import type { MercenaryTemplate } from '../../../types/mercenary'

export const naja: MercenaryTemplate = {
  id: 'naja',
  name: '나쟈',
  type: 'attacker',
  star: 3,
  maxHp: 3173,
  atk: 2441,
  def: 0,
  emoji: '⚔️',
  imageId: '1635',
  critRate: 20,
  critDamage: 25,
  agility: 5,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'single',
    effects: [],
  },
}
