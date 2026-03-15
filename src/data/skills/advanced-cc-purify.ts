import type { Skill } from '../../types/skill'

/** 상급 구속 정화 — 아군의 CC 디버프 전체 제거 */
export const advancedCcPurify: Skill = {
  id: 'advanced_cc_purify',
  name: '상급 구속 정화',
  timing: 'after_attack',
  target: 'next_ally',
  effects: [{ type: 'purify_cc', value: 0 }],
}
