import type { MercenaryTemplate } from '../../../types/mercenary'

export const maria: MercenaryTemplate = {
  id: 'maria',
  name: '마리아',
  type: 'mage',
  star: 3,
  maxHp: 3630,
  atk: 2626,
  def: 0,
  emoji: '🔮',
  imageId: '835',
  critRate: 35,
  critDamage: 75,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 2,
    effects: [
      { type: 'dispel', value: 0, debuffClass: 'cc' },
      { type: 'dot', value: 0.5, debuffClass: 'dot', atkScaling: true },
      { type: 'all_stats_down', value: 35, duration: 18, debuffClass: 'stat_weaken' },
    ],
  },
}
