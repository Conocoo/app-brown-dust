import type { MercenaryTemplate } from '../../../types/mercenary'

export const britain: MercenaryTemplate = {
  id: 'britain',
  name: '브리튼',
  type: 'defender',
  star: 4,
  maxHp: 7483,
  atk: 1457,
  def: 15,
  emoji: '🛡️',
  imageId: '295',
  critRate: 35,
  critDamage: 85,
  agility: 10,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 3,
    effects: [
      { type: 'dot_31', value: 1, debuffClass: 'dot', atkScaling: true },
      { type: 'atk_down', value: 55, duration: 1, debuffClass: 'stat_weaken' },
      { type: 'atk_up', value: 100, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
