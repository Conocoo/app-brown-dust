import type { MercenaryTemplate } from '../../../types/mercenary'

export const kiria: MercenaryTemplate = {
  id: 'kiria',
  name: '키리아',
  type: 'attacker',
  star: 5,
  maxHp: 4872,
  atk: 1322,
  def: 0,
  emoji: '⚔️',
  imageId: '4005',
  critRate: 10,
  critDamage: 50,
  agility: 50,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [
      { type: 'dispel', value: 0, debuffClass: 'cc' },
      { type: 'dot_pierce', value: 0.3, debuffClass: 'dot' },
      { type: 'dot_direct', value: 1.05, debuffClass: 'dot' },
      { type: 'crit_rate_up', value: 75, duration: 999, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
