import type { MercenaryTemplate } from '../../../types/mercenary'

export const dominique: MercenaryTemplate = {
  id: 'dominique',
  name: '도미니크',
  type: 'attacker',
  star: 4,
  maxHp: 4794,
  atk: 985,
  def: 5,
  emoji: '⚔️',
  imageId: '995',
  critRate: 10,
  critDamage: 50,
  agility: 20,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'single',
    effects: [
      { type: 'focus_fire', value: 0, duration: 6, debuffClass: 'cc' },
      { type: 'taunt_immune', value: 0, duration: 24, buffType: 'stat_enhance', target: 'self' },
      { type: 'atk_down', value: 50, duration: 24, debuffClass: 'stat_weaken' },
    ],
  },
}
