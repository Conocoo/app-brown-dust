import type { MercenaryTemplate } from '../../../types/mercenary'

export const milim_nava: MercenaryTemplate = {
  id: 'milim_nava',
  name: 'ミリム',
  type: 'attacker',
  star: 5,
  maxHp: 6093,
  atk: 1865,
  def: 0,
  emoji: '⚔️',
  imageId: '3965',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [],
  },
}
