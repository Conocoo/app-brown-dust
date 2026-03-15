import type { Skill } from '../../types/skill'

/** 재생 — 매 턴 최대HP×14% 회복, 15턴 */
export const regeneration: Skill = {
  id: 'regeneration',
  name: '재생',
  timing: 'after_attack',
  target: 'self',
  effects: [{
    type: 'regeneration',
    value: 14,
    duration: 15,
    buffType: 'stat_enhance',
  }],
}
