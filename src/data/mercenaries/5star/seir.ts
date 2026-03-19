import type { MercenaryTemplate } from '../../../types/mercenary'

export const seir: MercenaryTemplate = {
  id: 'seir',
  name: '세이르',
  type: 'defender',
  star: 5,
  maxHp: 9995,
  atk: 1151,
  def: 10,
  emoji: '🛡️',
  imageId: '2965',
  critRate: 65,
  critDamage: 75,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'single',
    effects: [
      { type: 'counter_attack', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'counter_attack', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'regeneration', value: 16, duration: 24, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot_pierce', value: 0.65, debuffClass: 'dot' },
      { type: 'taunt', value: 0, duration: 14, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
