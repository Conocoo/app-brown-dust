import type { Skill } from '../../types/skill'

/** 회복 (거인의 일격) — 적 사망 시 최대HP×100% 즉시회복 */
export const giantStrikeRecovery: Skill = {
  id: 'giant_strike_recovery',
  name: '회복',
  timing: 'after_attack',
  target: 'self',
  effects: [{ type: 'heal_percent', value: 100 }],
}
