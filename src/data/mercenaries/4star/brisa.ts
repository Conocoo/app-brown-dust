import type { MercenaryTemplate } from '../../../types/mercenary'

export const brisa: MercenaryTemplate = {
  id: 'brisa',
  name: '브리사',
  type: 'attacker',
  star: 4,
  maxHp: 4989,
  atk: 1862,
  def: 0,
  emoji: '⚔️',
  imageId: '2395',
  critRate: 10,
  critDamage: 50,
  agility: 40,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'atk_up', value: 200, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot_30', value: 1.6, debuffClass: 'dot', atkScaling: true },
      { type: 'taunt', value: 0, duration: 4, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
