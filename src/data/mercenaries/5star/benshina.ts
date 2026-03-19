import type { MercenaryTemplate } from '../../../types/mercenary'

export const benshina: MercenaryTemplate = {
  id: 'benshina',
  name: '밴시나',
  type: 'defender',
  star: 5,
  maxHp: 26122,
  atk: 963,
  def: 10,
  emoji: '🛡️',
  imageId: '4025',
  critRate: 20,
  critDamage: 0,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'back_n',
    rangeSize: 1,
    effects: [
      { type: 'dot', value: 0.15, debuffClass: 'dot' },
      { type: 'shield', value: 30, duration: 30, buffType: 'shield', target: 'self' },
      { type: 'regeneration', value: 1, duration: 30, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
