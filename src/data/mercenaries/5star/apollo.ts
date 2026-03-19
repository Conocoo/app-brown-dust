import type { MercenaryTemplate } from '../../../types/mercenary'

export const apollo: MercenaryTemplate = {
  id: 'apollo',
  name: '아폴론',
  type: 'attacker',
  star: 5,
  maxHp: 3423,
  atk: 4268,
  def: 5,
  emoji: '⚔️',
  imageId: '4605',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [
      { type: 'on_attack_trigger', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot_31', value: 0.3, duration: 12, debuffClass: 'dot', atkScaling: true },
      { type: 'shield', value: 30, duration: 12, debuffClass: 'stat_weaken' },
      { type: 'equipment', value: 0, duration: 10, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
