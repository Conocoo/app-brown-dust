import type { MercenaryTemplate } from '../../../types/mercenary'

export const dione: MercenaryTemplate = {
  id: 'dione',
  name: '디온느',
  type: 'attacker',
  star: 5,
  maxHp: 3022,
  atk: 2338,
  def: 10,
  emoji: '⚔️',
  imageId: '7005',
  critRate: 50,
  critDamage: 75,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [
      { type: 'ignore_taunt_range', value: 0, duration: 20, buffType: 'stat_enhance', target: 'self' },
      { type: 'taunt_immune', value: 0, duration: 20, buffType: 'stat_enhance', target: 'self' },
      { type: 'char_type_buff', value: 3, debuffClass: 'stat_weaken' },
      { type: 'dot_drain', value: 0.09, debuffClass: 'dot' },
      { type: 'damage_limit', value: 0.31, duration: 18, buffType: 'special', target: 'self' },
      { type: 'atk_up', value: 30, duration: 18, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
