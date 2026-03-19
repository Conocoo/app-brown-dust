import type { MercenaryTemplate } from '../../../types/mercenary'

export const kaci: MercenaryTemplate = {
  id: 'kaci',
  name: '케이시',
  type: 'defender',
  star: 3,
  maxHp: 5117,
  atk: 695,
  def: 12,
  emoji: '🛡️',
  imageId: '635',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [
      { type: 'shield', value: 50, duration: 6, buffType: 'shield', target: 'self' },
      { type: 'counter_attack', value: 0, duration: 12, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
