import type { MercenaryTemplate } from '../../../types/mercenary'

export const valtor: MercenaryTemplate = {
  id: 'valtor',
  name: '발토르',
  type: 'mage',
  star: 5,
  maxHp: 25444,
  atk: 1559,
  def: 10,
  emoji: '🔮',
  imageId: '2705',
  critRate: 20,
  critDamage: 50,
  agility: 5,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'back_n',
    rangeSize: 2,
    effects: [
      { type: 'added_buff_27', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot', value: 0.55, debuffClass: 'dot' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
      { type: 'regeneration', value: 4, duration: 70, buffType: 'stat_enhance', target: 'self' },
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
