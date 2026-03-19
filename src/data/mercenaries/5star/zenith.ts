import type { MercenaryTemplate } from '../../../types/mercenary'

export const zenith: MercenaryTemplate = {
  id: 'zenith',
  name: '제니스',
  type: 'defender',
  star: 5,
  maxHp: 7014,
  atk: 993,
  def: 10,
  emoji: '🛡️',
  imageId: '3055',
  critRate: 10,
  critDamage: 50,
  agility: 35,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'single',
    effects: [
      { type: 'counter_attack', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'agility_up', value: 65, duration: 10, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
