import type { Skill } from '../../types/skill'

/** 상급 기절 — 행동 불가 + 받는 피해량 증가 */
export const advancedStun: Skill = {
  id: 'advanced_stun',
  name: '상급 기절',
  timing: 'after_attack',
  target: 'enemy_front',
  effects: [
    { type: 'stun', value: 0, duration: 12, debuffClass: 'cc', dmgTakenUp: 65 },
  ],
}
