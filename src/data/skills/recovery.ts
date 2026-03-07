import type { Skill } from '../../types/skill'

/** 회복 — 적 사망 시 최대생명력 100% 즉시회복 */
export const recovery: Skill = {
  id: 'recovery',
  name: '회복',
  timing: 'after_attack',
  target: 'self',
  effects: [
    { type: 'on_kill_heal_percent', value: 100 },
  ],
}
