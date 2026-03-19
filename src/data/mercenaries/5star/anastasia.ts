import type { MercenaryTemplate } from '../../../types/mercenary'

export const anastasia: MercenaryTemplate = {
  id: 'anastasia',
  name: '아나스타샤',
  type: 'attacker',
  star: 5,
  maxHp: 3697,
  atk: 947,
  def: 0,
  emoji: '⚔️',
  imageId: '3595',
  critRate: 0,
  critDamage: 0,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_third',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [
      { type: 'insert_buff', value: 0, debuffClass: 'stat_weaken' },
      { type: 'dot_pierce', value: 0.55, debuffClass: 'dot' },
      { type: 'dot', value: 0.5, duration: 4, debuffClass: 'dot', atkScaling: true },
      { type: 'shield', value: 50, duration: 4, debuffClass: 'stat_weaken' },
      { type: 'stun', value: 0, duration: 4, debuffClass: 'cc' },
      { type: 'shield', value: 30, duration: 4, debuffClass: 'stat_weaken' },
    ],
  },
}
