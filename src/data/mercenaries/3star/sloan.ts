import type { MercenaryTemplate } from '../../../types/mercenary'

export const sloan: MercenaryTemplate = {
  id: 'sloan',
  name: '슬론',
  type: 'defender',
  star: 3,
  maxHp: 5574,
  atk: 896,
  def: 10,
  emoji: '🛡️',
  critRate: 5,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'counter_attack', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot', value: 0.025, duration: 10, debuffClass: 'dot' },
    ],
  },
}
