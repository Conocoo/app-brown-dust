import type { MercenaryTemplate } from '../../../types/mercenary'

export const blaze: MercenaryTemplate = {
  id: 'blaze',
  name: '블레이즈',
  type: 'attacker',
  star: 3,
  maxHp: 3741,
  atk: 1146,
  def: 5,
  emoji: '⚔️',
  imageId: '3125',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'explosion', value: 1.5, debuffClass: 'dot', atkScaling: true },
      { type: 'explosion', value: 1.5, debuffClass: 'dot', atkScaling: true },
      { type: 'temp_hp', value: 1, duration: 4, buffType: 'special', target: 'self' },
    ],
  },
}
