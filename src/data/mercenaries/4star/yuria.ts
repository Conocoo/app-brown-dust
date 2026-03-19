import type { MercenaryTemplate } from '../../../types/mercenary'

export const yuria: MercenaryTemplate = {
  id: 'yuria',
  name: '유리아',
  type: 'defender',
  star: 4,
  maxHp: 5553,
  atk: 1084,
  def: 10,
  emoji: '🛡️',
  imageId: '2755',
  critRate: 25,
  critDamage: 75,
  agility: 10,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'front_n',
    rangeSize: 1,
    effects: [
      { type: 'dispel', value: 0, debuffClass: 'cc' },
      { type: 'equipment', value: 0, duration: 12, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
