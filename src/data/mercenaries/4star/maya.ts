import type { MercenaryTemplate } from '../../../types/mercenary'

export const maya: MercenaryTemplate = {
  id: 'maya',
  name: '마야',
  type: 'attacker',
  star: 4,
  maxHp: 4794,
  atk: 925,
  def: 5,
  emoji: '⚔️',
  imageId: '925',
  critRate: 10,
  critDamage: 50,
  agility: 20,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'single',
    effects: [
      { type: 'focus_fire', value: 0, duration: 6, debuffClass: 'cc' },
      { type: 'atk_down', value: 50, duration: 24, debuffClass: 'stat_weaken' },
    ],
  },
}
