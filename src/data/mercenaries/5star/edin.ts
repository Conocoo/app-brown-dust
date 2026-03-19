import type { MercenaryTemplate } from '../../../types/mercenary'

export const edin: MercenaryTemplate = {
  id: 'edin',
  name: '에딘',
  type: 'attacker',
  star: 5,
  maxHp: 5438,
  atk: 6665,
  def: 10,
  emoji: '⚔️',
  imageId: '1325',
  critRate: 65,
  critDamage: 75,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'atk_up', value: 30, duration: 24, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot_drain', value: 0.3, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot_pierce', value: 1.25, debuffClass: 'dot' },
      { type: 'extra_turn', value: 0, duration: 999, buffType: 'special', target: 'self' },
    ],
  },
}
