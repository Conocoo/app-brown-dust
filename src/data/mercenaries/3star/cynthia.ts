import type { MercenaryTemplate } from '../../../types/mercenary'

export const cynthia: MercenaryTemplate = {
  id: 'cynthia',
  name: '신시아',
  type: 'mage',
  star: 3,
  maxHp: 2505,
  atk: 1619,
  def: 5,
  emoji: '🔮',
  imageId: '705',
  critRate: 15,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'x_shape',
    rangeSize: 1,
    effects: [
      { type: 'stun', value: 0, duration: 12, debuffClass: 'cc' },
      { type: 'dot', value: 0.2, debuffClass: 'dot', atkScaling: true },
      { type: 'counter_attack', value: 0, duration: 24, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
