import type { MercenaryTemplate } from '../../../types/mercenary'

export const grace: MercenaryTemplate = {
  id: 'grace',
  name: '그레이스',
  type: 'defender',
  star: 4,
  maxHp: 6041,
  atk: 963,
  def: 10,
  emoji: '🛡️',
  imageId: '3105',
  critRate: 10,
  critDamage: 50,
  agility: 25,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'counter_attack', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'agility_up', value: 75, duration: 6, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
