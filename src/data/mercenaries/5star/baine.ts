import type { MercenaryTemplate } from '../../../types/mercenary'

export const baine: MercenaryTemplate = {
  id: 'baine',
  name: '바인',
  type: 'defender',
  star: 5,
  maxHp: 14367,
  atk: 134,
  def: 15,
  emoji: '🛡️',
  imageId: '3305',
  critRate: 0,
  critDamage: 0,
  agility: 10,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 3,
    effects: [
      { type: 'added_buff_25', value: 0, duration: 35, buffType: 'stat_enhance', target: 'self' },
      { type: 'added_buff_27', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'taunt', value: 0, duration: 18, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
