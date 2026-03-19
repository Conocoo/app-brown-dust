import type { MercenaryTemplate } from '../../../types/mercenary'

export const shion: MercenaryTemplate = {
  id: 'shion',
  name: 'シオン',
  type: 'attacker',
  star: 4,
  maxHp: 3837,
  atk: 1205,
  def: 0,
  emoji: '⚔️',
  imageId: '3995',
  critRate: 25,
  critDamage: 75,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [],
  },
}
