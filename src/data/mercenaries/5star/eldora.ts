import type { MercenaryTemplate } from '../../../types/mercenary'

export const eldora: MercenaryTemplate = {
  id: 'eldora',
  name: '엘도라',
  type: 'mage',
  star: 5,
  maxHp: 3730,
  atk: 6879,
  def: 0,
  emoji: '🔮',
  imageId: '2725',
  critRate: 20,
  critDamage: 100,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'front_n',
    rangeSize: 3,
    effects: [
      { type: 'insert_buff', value: 0, duration: 4, debuffClass: 'stat_weaken' },
      { type: 'damage_amp', value: 70, duration: 4, debuffClass: 'cc' },
      { type: 'on_death_trigger', value: 0, duration: 1, debuffClass: 'stat_weaken' },
      { type: 'char_type_buff', value: 2, debuffClass: 'stat_weaken' },
      { type: 'dot_31', value: 0.7, duration: 12, debuffClass: 'dot', atkScaling: true },
      { type: 'shield', value: 70, duration: 12, debuffClass: 'stat_weaken' },
      { type: 'shield', value: 50, duration: 16, buffType: 'shield', target: 'self' },
      { type: 'taunt_immune', value: 0, duration: 16, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
