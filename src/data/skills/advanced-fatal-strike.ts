import type { Skill } from '../../types/skill'

/** 상급 극강의 일격 — ATK×50% 추가피해 */
export const advancedFatalStrike: Skill = {
  id: 'advanced_fatal_strike',
  name: '상급 극강의 일격',
  timing: 'after_attack',
  target: 'enemy_front',
  effects: [
    { type: 'damage', value: 50, atkScaling: true },
  ],
}
