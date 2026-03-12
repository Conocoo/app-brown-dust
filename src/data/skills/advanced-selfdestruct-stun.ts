import type { Skill } from '../../types/skill'

/** 상급 자폭 기절 — 기절 + 받는 피해량 증가, 발동 후 자신 즉사 */
export const advancedSelfdestructStun: Skill = {
  id: 'advanced_selfdestruct_stun',
  name: '상급 자폭 기절',
  timing: 'after_attack',
  target: 'enemy_front',
  effects: [
    { type: 'stun', value: 0, duration: 18, debuffClass: 'cc', dmgTakenUp: 50 },
  ],
}
