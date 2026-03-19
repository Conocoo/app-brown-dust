import type { MercenaryTemplate } from '../../../types/mercenary'

export const arwen: MercenaryTemplate = {
  id: 'arwen',
  name: '아르웬',
  type: 'defender',
  star: 5,
  maxHp: 9142,
  atk: 1088,
  def: 10,
  emoji: '🛡️',
  imageId: '3775',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'counter_attack', value: 0, duration: 20, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot', value: 1.35, debuffClass: 'dot' },
      { type: 'count_guard', value: 0, duration: 8, buffType: 'special', target: 'self' },
      { type: 'counter_attack', value: 0, duration: 8, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
