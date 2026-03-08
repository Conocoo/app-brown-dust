import type { Skill } from '../../types/skill'

/** 상급 적중의 강타 — 치명확률 × 공격력 × 150% 추가피해 */
export const advancedPrecisionStrike: Skill = {
  id: 'advanced_precision_strike',
  name: '상급 적중의 강타',
  timing: 'after_attack',
  target: 'enemy_front',
  effects: [
    { type: 'crit_scaling_damage', value: 150 },
  ],
}
