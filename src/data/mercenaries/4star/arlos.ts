import type { MercenaryTemplate } from '../../../types/mercenary'

export const arlos: MercenaryTemplate = {
  id: 'arlos',
  name: '알로스',
  type: 'defender',
  star: 4,
  maxHp: 6332,
  atk: 1052,
  def: 10,
  emoji: '🛡️',
  imageId: '575',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
      { type: 'added_buff_27', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'taunt', value: 0, duration: 8, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
