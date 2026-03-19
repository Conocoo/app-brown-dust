import type { MercenaryTemplate } from '../../../types/mercenary'

export const larkis: MercenaryTemplate = {
  id: 'larkis',
  name: '라키스',
  type: 'attacker',
  star: 5,
  maxHp: 3480,
  atk: 2372,
  def: 0,
  emoji: '⚔️',
  imageId: '3935',
  critRate: 10,
  critDamage: 50,
  agility: 10,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [
      { type: 'counter_attack', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'counter_attack', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'direct_damage', value: 1, debuffClass: 'stat_weaken', atkScaling: true },
      { type: 'direct_damage', value: 1.5, debuffClass: 'stat_weaken' },
    ],
  },
}
