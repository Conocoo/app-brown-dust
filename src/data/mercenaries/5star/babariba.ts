import type { MercenaryTemplate } from '../../../types/mercenary'

export const babariba: MercenaryTemplate = {
  id: 'babariba',
  name: '바바리바',
  type: 'support',
  star: 5,
  maxHp: 972,
  atk: 0,
  def: 10,
  emoji: '💚',
  imageId: '4295',
  critRate: 0,
  critDamage: 0,
  agility: 35,
  skill: {
    timing: 'after_attack',
    target: 'next_ally',
    attackRange: 'single',
    effects: [
      { type: 'char_type_buff', value: 2, debuffClass: 'stat_weaken' },
      { type: 'char_type_buff', value: 1, buffType: 'stat_enhance' },
      { type: 'equipment', value: 0, duration: 8, buffType: 'stat_enhance' },
      { type: 'def_up', value: 90, duration: 8, buffType: 'stat_enhance' },
    ],
  },
}
