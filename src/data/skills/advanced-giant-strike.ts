import type { Skill } from '../../types/skill'

/** 상급 거인의 일격 — 최대HP×40% 추가피해, 적 사망 시 회복 트리거 */
export const advancedGiantStrike: Skill = {
  id: 'advanced_giant_strike',
  name: '상급 거인의 일격',
  timing: 'after_attack',
  target: 'enemy_front',
  effects: [
    { type: 'giant_strike', value: 40, duration: 1 },
    { type: 'on_kill_trigger', value: 0, triggerSkill: 'giant_strike_recovery' },
  ],
}
