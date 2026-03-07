import type { Skill } from '../../types/skill'

/** 상급 지속 피해 면역 — DoT 면역(18턴) + 받는 피해량 -50% */
export const advancedDotImmune: Skill = {
  id: 'advanced_dot_immune',
  name: '상급 지속 피해 면역',
  timing: 'before_attack',
  target: 'self',
  effects: [
    { type: 'dot_immune', value: 0, duration: 18, buffType: 'special' },
    { type: 'shield', value: 50, duration: 18, buffType: 'shield' },
  ],
}
