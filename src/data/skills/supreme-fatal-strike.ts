import type { Skill } from '../../types/skill'

/** 최상급 극강의 일격 — ATK×200% 추가피해 */
export const supremeFatalStrike: Skill = {
  id: 'supreme_fatal_strike',
  name: '최상급 극강의 일격',
  timing: 'after_attack',
  target: 'enemy_front',
  effects: [
    { type: 'damage', value: 200, atkScaling: true },
  ],
}
