import type { MercenaryTemplate } from '../../../types/mercenary'

export const marlene: MercenaryTemplate = {
  id: 'marlene',
  name: '마를렌',
  type: 'mage',
  star: 3,
  maxHp: 2505,
  atk: 1189,
  def: 0,
  emoji: '🔮',
  imageId: '365',
  critRate: 15,
  critDamage: 50,
  agility: 5,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [
      { type: 'def_down', value: 20, duration: 18, debuffClass: 'stat_weaken' },
      { type: 'char_type_buff', value: 2, debuffClass: 'stat_weaken' },
      { type: 'dispel', value: 0, debuffClass: 'cc' },
    ],
  },
}
