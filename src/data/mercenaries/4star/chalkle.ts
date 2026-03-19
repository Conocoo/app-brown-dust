import type { MercenaryTemplate } from '../../../types/mercenary'

export const chalkle: MercenaryTemplate = {
  id: 'chalkle',
  name: '초클',
  type: 'mage',
  star: 4,
  maxHp: 1001,
  atk: 5882,
  def: 0,
  emoji: '🔮',
  imageId: '2995',
  critRate: 20,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'x_shape',
    rangeSize: 1,
    effects: [
      { type: 'dot', value: 0.1, duration: 5, debuffClass: 'dot', atkScaling: true },
      { type: 'counter_attack', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'summon', value: 0, duration: 999, debuffClass: 'stat_weaken' },
      { type: 'summon', value: 0, duration: 24, debuffClass: 'stat_weaken' },
    ],
  },
}
