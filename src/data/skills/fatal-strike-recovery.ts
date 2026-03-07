import type { Skill } from '../../types/skill'

/** 회복 — 해당 턴 내 적 사망 시 최대HP×50% 회복 */
export const fatalStrikeRecovery: Skill = {
  id: 'fatal_strike_recovery',
  name: '회복',
  timing: 'after_attack',
  target: 'self',
  effects: [
    { type: 'on_kill_heal_percent', value: 50 },
  ],
}
