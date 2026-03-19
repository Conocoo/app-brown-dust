import type { MercenaryTemplate } from '../../../types/mercenary'

export const sobalina: MercenaryTemplate = {
  id: 'sobalina',
  name: '소발리나',
  type: 'attacker',
  star: 4,
  maxHp: 1990,
  atk: 1990,
  def: 35,
  emoji: '⚔️',
  imageId: '8326',
  critRate: 100,
  critDamage: 50,
  agility: 100,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [
      { type: 'dot_31', value: 0.3, debuffClass: 'dot', atkScaling: true },
      { type: 'summon', value: 0, duration: 12, debuffClass: 'stat_weaken' },
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'shield', value: 35, duration: 999, buffType: 'shield', target: 'self' },
      { type: 'count_guard', value: 0, duration: 2, buffType: 'special', target: 'self' },
    ],
  },
}
