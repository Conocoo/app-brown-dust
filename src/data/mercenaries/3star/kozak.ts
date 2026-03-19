import type { MercenaryTemplate } from '../../../types/mercenary'

export const kozak: MercenaryTemplate = {
  id: 'kozak',
  name: '코자크',
  type: 'attacker',
  star: 3,
  maxHp: 3843,
  atk: 933,
  def: 5,
  emoji: '⚔️',
  imageId: '2155',
  critRate: 15,
  critDamage: 75,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'shield', value: 20, duration: 10, debuffClass: 'stat_weaken' },
      { type: 'dot', value: 0.02, duration: 10, debuffClass: 'dot' },
    ],
  },
}
