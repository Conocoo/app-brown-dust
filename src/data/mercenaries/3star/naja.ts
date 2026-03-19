import type { MercenaryTemplate } from '../../../types/mercenary'

export const naja: MercenaryTemplate = {
  id: 'naja',
  name: '나쟈',
  type: 'attacker',
  star: 3,
  maxHp: 3173,
  atk: 2441,
  def: 0,
  emoji: '⚔️',
  imageId: '1635',
  critRate: 20,
  critDamage: 25,
  agility: 5,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'single',
    effects: [
      { type: 'atk_down', value: 80, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'on_attack_trigger', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'char_type_buff', value: 3, debuffClass: 'stat_weaken' },
      { type: 'atk_up', value: 15, duration: 4, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
