import type { MercenaryTemplate } from '../../../types/mercenary'

export const jacklin: MercenaryTemplate = {
  id: 'jacklin',
  name: '재클린',
  type: 'defender',
  star: 4,
  maxHp: 8485,
  atk: 1008,
  def: 10,
  emoji: '🛡️',
  imageId: '2875',
  critRate: 10,
  critDamage: 50,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'regeneration', value: 2, duration: 10, buffType: 'stat_enhance', target: 'self' },
      { type: 'regeneration', value: 4, duration: 5, buffType: 'stat_enhance', target: 'self' },
      { type: 'equipment', value: 0, duration: 18, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
