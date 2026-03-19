import type { MercenaryTemplate } from '../../../types/mercenary'

export const rosa: MercenaryTemplate = {
  id: 'rosa',
  name: '로자',
  type: 'defender',
  star: 3,
  maxHp: 4715,
  atk: 763,
  def: 10,
  emoji: '🛡️',
  imageId: '325',
  critRate: 10,
  critDamage: 75,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'char_type_buff', value: 2, debuffClass: 'stat_weaken' },
      { type: 'def_down', value: 30, duration: 12, debuffClass: 'stat_weaken' },
    ],
  },
}
