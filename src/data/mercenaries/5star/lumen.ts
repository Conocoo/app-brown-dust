import type { MercenaryTemplate } from '../../../types/mercenary'

export const lumen: MercenaryTemplate = {
  id: 'lumen',
  name: '루멘',
  type: 'mage',
  star: 5,
  maxHp: 3582,
  atk: 3438,
  def: 0,
  emoji: '🔮',
  imageId: '3825',
  critRate: 35,
  critDamage: 75,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 4,
    effects: [
      { type: 'revival', value: 0, buffType: 'special', target: 'self' },
      { type: 'dot_30', value: 1.5, debuffClass: 'dot', atkScaling: true },
      { type: 'taunt_immune', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
