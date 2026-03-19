import type { MercenaryTemplate } from '../../../types/mercenary'

export const corette: MercenaryTemplate = {
  id: 'corette',
  name: '코레트',
  type: 'attacker',
  star: 4,
  maxHp: 3952,
  atk: 1017,
  def: 0,
  emoji: '⚔️',
  imageId: '3325',
  critRate: 5,
  critDamage: 35,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'x_shape',
    rangeSize: 1,
    effects: [
      { type: 'all_stats_down', value: 15, duration: 6, debuffClass: 'stat_weaken' },
      { type: 'equipment', value: 0, duration: 12, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
