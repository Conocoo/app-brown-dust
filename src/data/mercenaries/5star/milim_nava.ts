import type { MercenaryTemplate } from '../../../types/mercenary'

export const milim_nava: MercenaryTemplate = {
  id: 'milim_nava',
  name: 'ミリム',
  type: 'attacker',
  star: 5,
  maxHp: 6093,
  atk: 1865,
  def: 0,
  emoji: '⚔️',
  imageId: '3965',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'atk_up', value: 10, duration: 6, buffType: 'stat_enhance', target: 'self' },
      { type: 'crit_damage_up', value: 10, duration: 6, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot', value: 1, debuffClass: 'dot', atkScaling: true },
      { type: 'dot', value: 0.1, duration: 6, debuffClass: 'dot', atkScaling: true },
      { type: 'added_buff_27', value: 0, duration: 24, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
