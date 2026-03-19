import type { MercenaryTemplate } from '../../../types/mercenary'

export const aiela: MercenaryTemplate = {
  id: 'aiela',
  name: '아일라',
  type: 'defender',
  star: 4,
  maxHp: 4775,
  atk: 854,
  def: 0,
  emoji: '🛡️',
  imageId: '4265',
  critRate: 10,
  critDamage: 50,
  agility: 20,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot_variant', value: 0.02, duration: 8, debuffClass: 'dot', atkScaling: true },
      { type: 'stun', value: 0, duration: 8, debuffClass: 'cc' },
      { type: 'taunt', value: 0, duration: 4, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
