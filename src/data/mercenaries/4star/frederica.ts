import type { MercenaryTemplate } from '../../../types/mercenary'

export const frederica: MercenaryTemplate = {
  id: 'frederica',
  name: '프레데리카',
  type: 'defender',
  star: 4,
  maxHp: 5898,
  atk: 1023,
  def: 10,
  emoji: '🛡️',
  imageId: '1395',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'dispel', value: 0, debuffClass: 'cc' },
      { type: 'counter_attack', value: 0, duration: 12, buffType: 'stat_enhance', target: 'self' },
      { type: 'silence', value: 0, duration: 12, debuffClass: 'cc' },
    ],
  },
}
