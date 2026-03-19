import type { MercenaryTemplate } from '../../../types/mercenary'

export const slain: MercenaryTemplate = {
  id: 'slain',
  name: '슬레인',
  type: 'attacker',
  star: 5,
  maxHp: 4891,
  atk: 2654,
  def: 0,
  emoji: '⚔️',
  imageId: '4235',
  critRate: 65,
  critDamage: 75,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'single',
    effects: [
      { type: 'dot_31', value: 0.4, debuffClass: 'dot' },
      { type: 'dot_31', value: 0.4, duration: 4, debuffClass: 'dot', atkScaling: true },
      { type: 'shield', value: 95, duration: 2, buffType: 'shield', target: 'self' },
      { type: 'crit_damage_up', value: 50, duration: 50, buffType: 'stat_enhance', target: 'self' },
      { type: 'atk_up', value: 50, duration: 50, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
