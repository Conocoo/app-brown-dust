import type { MercenaryTemplate } from '../../../types/mercenary'

export const sloan: MercenaryTemplate = {
  id: 'sloan',
  name: '슬론',
  type: 'defender',
  star: 3,
  maxHp: 5574,
  atk: 896,
  def: 10,
  emoji: '🛡️',
  critRate: 5,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'poison_counter', value: 0, duration: 999, buffType: 'special', target: 'self' },
      { type: 'on_hit_recovery', value: 0, duration: 999, buffType: 'special', target: 'self' },
      { type: 'poison', value: 12, atkScaling: true, duration: 6, debuffClass: 'dot' },
      { type: 'shield', value: 35, duration: 12, buffType: 'shield', triggerSkill: 'purify_dot', target: 'self' },
      { type: 'decay', value: 2.5, duration: 10, debuffClass: 'dot' },
      { type: 'heal_percent', value: 10, target: 'self' },
    ],
  },
}
