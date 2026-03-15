import type { Skill } from '../../types/skill'

/** 상급 재생 부여 — 매 턴 최대HP×10% 회복 + 즉시 최대HP×5% 회복 */
export const advancedRegenerationGrant: Skill = {
  id: 'advanced_regeneration_grant',
  name: '상급 재생 부여',
  timing: 'after_attack',
  target: 'next_ally',
  effects: [
    { type: 'regeneration', value: 10, spScaling: true, duration: 14, buffType: 'stat_enhance' },
    { type: 'heal_percent', value: 5 },
  ],
}
