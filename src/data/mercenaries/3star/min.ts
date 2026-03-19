import type { MercenaryTemplate } from '../../../types/mercenary'

export const min: MercenaryTemplate = {
  id: 'min',
  name: '미네',
  type: 'defender',
  star: 3,
  maxHp: 4910,
  atk: 927,
  def: 10,
  emoji: '🛡️',
  imageId: '585',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'dot_variant', value: 0.04, duration: 4, debuffClass: 'dot', atkScaling: true },
      { type: 'stun', value: 0, duration: 4, debuffClass: 'cc' },
      { type: 'shield', value: 30, duration: 4, debuffClass: 'stat_weaken' },
    ],
  },
}
