import type { MercenaryTemplate } from '../../../types/mercenary'

export const impaired_elephant: MercenaryTemplate = {
  id: 'impaired_elephant',
  name: '불편한 코끼리',
  type: 'mage',
  star: 4,
  maxHp: 99251,
  atk: 22075,
  def: 0,
  emoji: '🔮',
  imageId: '8353',
  critRate: 0,
  critDamage: 0,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [
      { type: 'counter_attack', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'shield', value: 70, duration: 999, buffType: 'shield', target: 'self' },
    ],
  },
}
