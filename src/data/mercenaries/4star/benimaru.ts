import type { MercenaryTemplate } from '../../../types/mercenary'

export const benimaru: MercenaryTemplate = {
  id: 'benimaru',
  name: 'ベニマル',
  type: 'mage',
  star: 4,
  maxHp: 2877,
  atk: 1703,
  def: 0,
  emoji: '🔮',
  imageId: '3975',
  critRate: 30,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [
      { type: 'on_death_trigger', value: 0, duration: 18, debuffClass: 'stat_weaken' },
      { type: 'dot', value: 1.5, debuffClass: 'dot', atkScaling: true },
      { type: 'dot', value: 0.5, debuffClass: 'dot', atkScaling: true },
      { type: 'dot', value: 0.02, duration: 6, debuffClass: 'dot', atkScaling: true },
    ],
  },
}
