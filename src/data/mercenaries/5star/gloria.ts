import type { MercenaryTemplate } from '../../../types/mercenary'

export const gloria: MercenaryTemplate = {
  id: 'gloria',
  name: '글로리아',
  type: 'defender',
  star: 5,
  maxHp: 14367,
  atk: 1112,
  def: 15,
  emoji: '🛡️',
  imageId: '2355',
  critRate: 20,
  critDamage: 75,
  agility: 10,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'revival', value: 0, duration: 18, buffType: 'special', target: 'self' },
      { type: 'counter_attack', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot_direct', value: 1.5, debuffClass: 'dot' },
    ],
  },
}
