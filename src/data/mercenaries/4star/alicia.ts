import type { MercenaryTemplate } from '../../../types/mercenary'

export const alicia: MercenaryTemplate = {
  id: 'alicia',
  name: '알리사',
  type: 'mage',
  star: 4,
  maxHp: 4312,
  atk: 2130,
  def: 0,
  emoji: '🔮',
  imageId: '715',
  critRate: 35,
  critDamage: 75,
  agility: 10,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 3,
    effects: [
      { type: 'stun', value: 0, duration: 12, debuffClass: 'cc' },
      { type: 'summon', value: 0, duration: 24, debuffClass: 'stat_weaken' },
      { type: 'char_type_buff', value: 3, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'taunt_immune', value: 0, duration: 30, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
