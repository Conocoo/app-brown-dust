import type { Skill } from '../../types/skill'

/** 상급 극강의 일격 — ATK×50% 추가피해 + 해당 턴 내 적 사망 시 최대HP×50% 회복 */
export const advancedFatalStrike: Skill = {
  id: 'advanced_fatal_strike',
  name: '상급 극강의 일격',
  timing: 'after_attack',
  target: 'enemy_front',
  effects: [
    { type: 'damage', value: 50, atkScaling: true },
    { type: 'on_kill_heal_percent', value: 50 },
  ],
}
