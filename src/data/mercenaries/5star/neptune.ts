import type { MercenaryTemplate } from '../../../types/mercenary'

export const neptune: MercenaryTemplate = {
  id: 'neptune',
  name: '넵튠',
  type: 'mage',
  star: 5,
  maxHp: 2935,
  atk: 3528,
  def: 5,
  emoji: '🔮',
  imageId: '4615',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 3,
    effects: [
      { type: 'char_type_buff', value: 2, debuffClass: 'stat_weaken' },
      { type: 'direct_damage', value: 2.6, debuffClass: 'stat_weaken' },
      { type: 'dot_drain', value: 0.25, debuffClass: 'dot' },
      { type: 'turn_pass', value: 0, duration: 10, buffType: 'stat_enhance', target: 'self' },
      { type: 'damage_limit', value: 0.46, duration: 10, buffType: 'special', target: 'self' },
    ],
  },
}
