import type { Skill } from '../../types/skill'

/** 상급 보호막 — 받는 피해량 -35%, 12턴, 고통 정화 트리거 */
export const advancedShield: Skill = {
  id: 'advanced_shield',
  name: '상급 보호막',
  timing: 'after_attack',
  target: 'self',
  effects: [{
    type: 'shield',
    value: 35,
    duration: 12,
    buffType: 'shield',
    triggerSkill: 'purify_dot',
  }],
}
