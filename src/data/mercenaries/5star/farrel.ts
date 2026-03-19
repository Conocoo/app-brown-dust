import type { MercenaryTemplate } from '../../../types/mercenary'

export const farrel: MercenaryTemplate = {
  id: 'farrel',
  name: '파렐',
  type: 'attacker',
  star: 5,
  maxHp: 5546,
  atk: 1348,
  def: 5,
  emoji: '⚔️',
  imageId: '2845',
  critRate: 20,
  critDamage: 25,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [
      { type: 'dot', value: 0.05, duration: 10, debuffClass: 'dot', atkScaling: true },
      { type: 'crit_damage_up', value: 5, duration: 25, buffType: 'stat_enhance', target: 'self' },
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
