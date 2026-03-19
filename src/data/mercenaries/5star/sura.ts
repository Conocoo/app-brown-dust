import type { MercenaryTemplate } from '../../../types/mercenary'

export const sura: MercenaryTemplate = {
  id: 'sura',
  name: '수라',
  type: 'defender',
  star: 5,
  maxHp: 5871,
  atk: 1118,
  def: 5,
  emoji: '🛡️',
  imageId: '4425',
  critRate: 30,
  critDamage: 75,
  agility: 30,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 3,
    effects: [
      { type: 'temp_hp', value: 12, duration: 75, buffType: 'special', target: 'self' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot_31', value: 0.9, debuffClass: 'dot' },
      { type: 'shield', value: 50, duration: 20, buffType: 'shield', target: 'self' },
      { type: 'count_guard', value: 0, duration: 20, buffType: 'special', target: 'self' },
    ],
  },
}
