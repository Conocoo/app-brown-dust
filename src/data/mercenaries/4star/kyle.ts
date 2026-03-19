import type { MercenaryTemplate } from '../../../types/mercenary'

export const kyle: MercenaryTemplate = {
  id: 'kyle',
  name: '카일',
  type: 'mage',
  star: 4,
  maxHp: 2800,
  atk: 1534,
  def: 0,
  emoji: '🔮',
  imageId: '1455',
  critRate: 15,
  critDamage: 50,
  agility: 5,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'cross',
    rangeSize: 2,
    effects: [
      { type: 'dot_variant', value: 0.1, duration: 6, debuffClass: 'dot', atkScaling: true },
      { type: 'stun', value: 0, duration: 6, debuffClass: 'cc' },
      { type: 'crit_rate_up', value: 100, duration: 999, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
