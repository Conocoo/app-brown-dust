import type { MercenaryTemplate } from '../../../types/mercenary'

export const hijin: MercenaryTemplate = {
  id: 'hijin',
  name: '히진',
  type: 'mage',
  star: 5,
  maxHp: 4941,
  atk: 1908,
  def: 5,
  emoji: '🔮',
  imageId: '1005',
  critRate: 20,
  critDamage: 50,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'cross',
    rangeSize: 2,
    effects: [
      { type: 'char_type_buff', value: 1, duration: 2, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot', value: 0.1, duration: 10, debuffClass: 'dot', atkScaling: true },
      { type: 'counter_attack', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'equipment', value: 0, duration: 18, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
