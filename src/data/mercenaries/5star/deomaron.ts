import type { MercenaryTemplate } from '../../../types/mercenary'

export const deomaron: MercenaryTemplate = {
  id: 'deomaron',
  name: '데오마론',
  type: 'defender',
  star: 5,
  maxHp: 8452,
  atk: 1023,
  def: 10,
  emoji: '🛡️',
  imageId: '2195',
  critRate: 50,
  critDamage: 25,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'dot', value: 0.06, duration: 6, debuffClass: 'dot' },
      { type: 'counter_attack', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'taunt', value: 0, duration: 10, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
