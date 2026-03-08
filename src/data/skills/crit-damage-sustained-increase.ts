import type { Skill } from '../../types/skill'

/** 치명피해 지속 증가 — 치명피해 +15%, 매 턴 +15% 누적 */
export const critDamageSustainedIncrease: Skill = {
  id: 'crit_damage_sustained_increase',
  name: '치명피해 지속 증가',
  timing: 'passive',
  target: 'self',
  effects: [
    { type: 'crit_damage_up', value: 15, duration: 30, buffType: 'stat_enhance' },
    { type: 'crit_damage_up_stacking', value: 15, duration: 30, buffType: 'special' },
  ],
}
