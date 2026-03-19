import type { MercenaryTemplate } from '../../../types/mercenary'

export const valz: MercenaryTemplate = {
  id: 'valz',
  name: '발제',
  type: 'attacker',
  star: 5,
  maxHp: 4891,
  atk: 2335,
  def: 0,
  emoji: '⚔️',
  imageId: '2935',
  critRate: 65,
  critDamage: 50,
  agility: 75,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'back_n',
    rangeSize: 2,
    effects: [
      { type: 'dispel', value: 0, debuffClass: 'cc' },
      { type: 'count_guard', value: 0, duration: 2, buffType: 'special', target: 'self' },
    ],
  },
}
