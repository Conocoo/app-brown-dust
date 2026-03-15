import type { Skill } from '../../types/skill'

/** 상급 중독 반격 — 피격 시 중독 부여 + 피격 시 회복 (패시브) */
export const advancedPoisonCounter: Skill = {
  id: 'advanced_poison_counter',
  name: '상급 중독 반격',
  timing: 'passive',
  target: 'self',
  effects: [
    { type: 'poison_counter', value: 0, duration: 999, buffType: 'special' },
    { type: 'on_hit_recovery', value: 0, duration: 999, buffType: 'special' },
  ],
}
