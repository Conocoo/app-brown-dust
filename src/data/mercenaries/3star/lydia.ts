import type { MercenaryTemplate } from '../../../types/mercenary'

export const lydia: MercenaryTemplate = {
  id: 'lydia',
  name: '리디아',
  type: 'attacker',
  star: 3,
  maxHp: 3510,
  atk: 874,
  def: 5,
  emoji: '⚔️',
  imageId: '3135',
  critRate: 15,
  critDamage: 75,
  agility: 5,
  skill: {
    timing: 'before_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [
      { type: 'dispel', value: 0, debuffClass: 'cc' },
      { type: 'agility_down', value: 50, duration: 6, debuffClass: 'stat_weaken' },
    ],
  },
}
