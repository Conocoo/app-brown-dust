import type { MercenaryTemplate } from '../../../types/mercenary'

export const kanna: MercenaryTemplate = {
  id: 'kanna',
  name: '칸나',
  type: 'attacker',
  star: 4,
  maxHp: 3837,
  atk: 880,
  def: 0,
  emoji: '⚔️',
  imageId: '3765',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [
      { type: 'atk_up', value: 50, duration: 18, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot_drain', value: 0.3, buffType: 'stat_enhance', target: 'self' },
      { type: 'char_type_buff', value: 1, debuffClass: 'stat_weaken' },
      { type: 'def_up', value: 65, duration: 2, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
