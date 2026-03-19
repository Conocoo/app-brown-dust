import type { MercenaryTemplate } from '../../../types/mercenary'

export const gifted_knight_aaron: MercenaryTemplate = {
  id: 'gifted_knight_aaron',
  name: '천재기사 아론',
  type: 'defender',
  star: 5,
  maxHp: 12647,
  atk: 306,
  def: 100,
  emoji: '🛡️',
  imageId: '9756',
  critRate: 60,
  critDamage: 300,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'single',
    effects: [
      { type: 'added_buff_27', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'taunt', value: 0, duration: 6, buffType: 'stat_enhance', target: 'self' },
      { type: 'crit_rate_up', value: 40, duration: 6, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
