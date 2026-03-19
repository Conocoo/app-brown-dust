import type { MercenaryTemplate } from '../../../types/mercenary'

export const beatric: MercenaryTemplate = {
  id: 'beatric',
  name: '베아트리체',
  type: 'attacker',
  star: 3,
  maxHp: 4013,
  atk: 1192,
  def: 5,
  emoji: '⚔️',
  imageId: '815',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'dispel', value: 0, debuffClass: 'cc' },
      { type: 'char_type_buff', value: 2, debuffClass: 'stat_weaken' },
    ],
  },
}
