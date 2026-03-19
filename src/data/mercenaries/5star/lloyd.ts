import type { MercenaryTemplate } from '../../../types/mercenary'

export const lloyd: MercenaryTemplate = {
  id: 'lloyd',
  name: '로이드',
  type: 'defender',
  star: 5,
  maxHp: 14100,
  atk: 1223,
  def: 5,
  emoji: '🛡️',
  imageId: '4205',
  critRate: 10,
  critDamage: 50,
  agility: 30,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'char_type_buff', value: 1, buffType: 'stat_enhance', target: 'self' },
      { type: 'instead_death', value: 0, duration: 70, buffType: 'special', target: 'self' },
      { type: 'counter_attack', value: 0, duration: 70, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
