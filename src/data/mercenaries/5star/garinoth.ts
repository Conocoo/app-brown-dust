import type { MercenaryTemplate } from '../../../types/mercenary'

export const garinoth: MercenaryTemplate = {
  id: 'garinoth',
  name: '가리노스',
  type: 'mage',
  star: 5,
  maxHp: 5382,
  atk: 480,
  def: 0,
  emoji: '🔮',
  imageId: '2365',
  critRate: 100,
  critDamage: 0,
  agility: 35,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [
      { type: 'crit_damage_up', value: 300, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'counter_attack', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot', value: 0.35, debuffClass: 'dot', atkScaling: true },
      { type: 'dot', value: 0.04, duration: 6, debuffClass: 'dot' },
      { type: 'dispel', value: 0, debuffClass: 'cc' },
    ],
  },
}
