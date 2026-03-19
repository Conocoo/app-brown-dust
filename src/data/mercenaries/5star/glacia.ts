import type { MercenaryTemplate } from '../../../types/mercenary'

export const glacia: MercenaryTemplate = {
  id: 'glacia',
  name: '글레이시아',
  type: 'defender',
  star: 5,
  maxHp: 7112,
  atk: 1546,
  def: 10,
  emoji: '🛡️',
  imageId: '2115',
  critRate: 75,
  critDamage: 75,
  agility: 5,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'counter_attack', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'instead_death', value: 0, duration: 8, buffType: 'special', target: 'self' },
      { type: 'instead_death', value: 0, duration: 8, buffType: 'special', target: 'self' },
      { type: 'taunt', value: 0, duration: 10, buffType: 'stat_enhance', target: 'self' },
      { type: 'equipment', value: 0, duration: 10, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
