import type { MercenaryTemplate } from '../../../types/mercenary'

export const cordelia: MercenaryTemplate = {
  id: 'cordelia',
  name: '코델리아',
  type: 'attacker',
  star: 3,
  maxHp: 2941,
  atk: 849,
  def: 3,
  emoji: '⚔️',
  imageId: '675',
  critRate: 7.5,
  critDamage: 75,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 2,
    effects: [
      { type: 'dot', value: 0.07, duration: 5, debuffClass: 'dot', atkScaling: true },
      { type: 'shield', value: 25, duration: 12, buffType: 'shield', target: 'self' },
    ],
  },
}
