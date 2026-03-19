import type { MercenaryTemplate } from '../../../types/mercenary'

export const aaron: MercenaryTemplate = {
  id: 'aaron',
  name: '아론',
  type: 'defender',
  star: 5,
  maxHp: 9791,
  atk: 993,
  def: 0,
  emoji: '🛡️',
  imageId: '3425',
  critRate: 10,
  critDamage: 75,
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
