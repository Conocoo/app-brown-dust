import type { MercenaryTemplate } from '../../../types/mercenary'

export const lakshmi: MercenaryTemplate = {
  id: 'lakshmi',
  name: '락슈미',
  type: 'attacker',
  star: 5,
  maxHp: 5037,
  atk: 2789,
  def: 15,
  emoji: '⚔️',
  imageId: '4485',
  critRate: 10,
  critDamage: 50,
  agility: 10,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [
      { type: 'char_type_buff', value: 2, debuffClass: 'stat_weaken' },
      { type: 'direct_damage', value: 0.6, debuffClass: 'stat_weaken' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
      { type: 'on_attack_trigger', value: 0, duration: 100, buffType: 'stat_enhance', target: 'self' },
      { type: 'shield', value: 30, duration: 50, buffType: 'shield', target: 'self' },
      { type: 'def_up', value: 50, duration: 50, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
