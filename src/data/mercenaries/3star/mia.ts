import type { MercenaryTemplate } from '../../../types/mercenary'

export const mia: MercenaryTemplate = {
  id: 'mia',
  name: '미아',
  type: 'attacker',
  star: 3,
  maxHp: 2505,
  atk: 475,
  def: 0,
  emoji: '⚔️',
  imageId: '2635',
  critRate: 10,
  critDamage: 50,
  agility: 20,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'single',
    effects: [
      { type: 'charm', value: 0, duration: 4, debuffClass: 'cc' },
      { type: 'position_change', value: 0, duration: 4, debuffClass: 'cc' },
      { type: 'atk_up', value: 20, duration: 4, debuffClass: 'stat_weaken' },
      { type: 'dispel', value: 0, debuffClass: 'cc' },
    ],
  },
}
