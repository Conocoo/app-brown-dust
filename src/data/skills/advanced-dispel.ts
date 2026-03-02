import type { Skill } from '../../types/skill'

/** 상급 무효화 — 적 버프 제거 + 이로운 효과 금지 연쇄 발동 */
export const advancedDispel: Skill = {
  id: 'advanced_dispel',
  name: '상급 무효화',
  timing: 'after_attack',
  target: 'enemy_front',
  effects: [
    { type: 'dispel', value: 0, triggerSkill: 'buff_block' },
  ],
}
