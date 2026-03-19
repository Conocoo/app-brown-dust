import type { MercenaryTemplate } from '../../../types/mercenary'

export const granhildr: MercenaryTemplate = {
  id: 'granhildr',
  name: '그란힐트',
  type: 'defender',
  star: 5,
  maxHp: 25692,
  atk: 1118,
  def: 20,
  emoji: '🛡️',
  imageId: '1785',
  critRate: 10,
  critDamage: 50,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [
      { type: 'reflect', value: 0, duration: 100, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot', value: 0.15, debuffClass: 'dot' },
      { type: 'regeneration', value: 6, duration: 999, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
