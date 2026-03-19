import type { MercenaryTemplate } from '../../../types/mercenary'

export const violent_rainbow: MercenaryTemplate = {
  id: 'violent_rainbow',
  name: '폭력적인 무지개',
  type: 'mage',
  star: 4,
  maxHp: 99251,
  atk: 61,
  def: 0,
  emoji: '🔮',
  imageId: '8351',
  critRate: 0,
  critDamage: 0,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [
      { type: 'char_type_buff', value: 3, debuffClass: 'stat_weaken' },
      { type: 'char_type_buff', value: 3, debuffClass: 'stat_weaken' },
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'shield', value: 70, duration: 999, buffType: 'shield', target: 'self' },
    ],
  },
}
