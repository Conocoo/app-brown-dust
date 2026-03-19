import type { MercenaryTemplate } from '../../../types/mercenary'

export const jin: MercenaryTemplate = {
  id: 'jin',
  name: '진',
  type: 'attacker',
  star: 5,
  maxHp: 5155,
  atk: 1243,
  def: 5,
  emoji: '⚔️',
  imageId: '2325',
  critRate: 10,
  critDamage: 50,
  agility: 65,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [],
  },
}
