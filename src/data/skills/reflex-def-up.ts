import type { Skill } from '../../types/skill'

/** 방어력 증가 — 반사 신경 피격 시 방어력 +100%, 1턴 */
export const reflexDefUp: Skill = {
  id: 'reflex_def_up',
  name: '방어력 증가',
  timing: 'after_attack',
  target: 'next_ally',
  effects: [{ type: 'def_up', value: 100, duration: 1, buffType: 'stat_enhance' }],
}
