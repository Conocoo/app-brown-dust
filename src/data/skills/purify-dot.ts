import type { Skill } from '../../types/skill'

/** 고통 정화 — 자신의 DoT 디버프 전체 제거 */
export const purifyDot: Skill = {
  id: 'purify_dot',
  name: '고통 정화',
  timing: 'after_attack',
  target: 'self',
  effects: [{ type: 'purify_dot', value: 0 }],
}
