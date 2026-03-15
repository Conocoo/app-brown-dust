import type { Skill } from '../../types/skill'

/** 치명확률 지속 증가 — 치명확률 +14%, 매 턴 +4% 누적 */
export const critRateSustainedIncrease: Skill = {
  id: 'crit_rate_sustained_increase',
  name: '치명확률 지속 증가',
  timing: 'passive',
  target: 'self',
  effects: [
    { type: 'crit_up', value: 14, duration: 50, buffType: 'stat_enhance' },
    { type: 'crit_up_stacking', value: 4, duration: 50, buffType: 'special' },
  ],
}
