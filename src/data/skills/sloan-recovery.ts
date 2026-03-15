import type { Skill } from '../../types/skill'

/** 회복 (슬론) — 최대HP×10% 즉시회복 */
export const sloanRecovery: Skill = {
  id: 'sloan_recovery',
  name: '회복',
  timing: 'before_attack',
  target: 'self',
  effects: [{ type: 'heal_percent', value: 10 }],
}
