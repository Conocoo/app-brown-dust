import type { MercenaryTemplate } from '../../../types/mercenary'

export const jayden: MercenaryTemplate = {
  id: 'jayden',
  name: '제이든',
  type: 'mage',
  star: 3,
  maxHp: 15039,
  atk: 1266,
  def: 10,
  emoji: '🔮',
  critRate: 25,
  critDamage: 75,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'single',
    effects: [
      { type: 'dot', value: 0.1, debuffClass: 'dot' },
      { type: 'crit_rate_up', value: 1, duration: 50, buffType: 'stat_enhance', target: 'self' },
      { type: 'regeneration', value: 5, duration: 15, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
