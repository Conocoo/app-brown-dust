import type { MercenaryTemplate } from '../../../types/mercenary'

export const dirty_unicorn: MercenaryTemplate = {
  id: 'dirty_unicorn',
  name: '더럽혀진 유니콘',
  type: 'defender',
  star: 4,
  maxHp: 98206,
  atk: 31,
  def: 0,
  emoji: '🛡️',
  imageId: '8350',
  critRate: 0,
  critDamage: 0,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'char_type_buff', value: 2, debuffClass: 'stat_weaken' },
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'shield', value: 70, duration: 999, buffType: 'shield', target: 'self' },
    ],
  },
}
