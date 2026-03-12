import type { Skill } from '../../types/skill'

/** 해로운 효과 면역 — 모든 디버프 면역 (영구) */
export const harmfulEffectImmunity: Skill = {
  id: 'harmful_effect_immunity',
  name: '해로운 효과 면역',
  timing: 'passive',
  target: 'self',
  effects: [{
    type: 'harmful_immune',
    value: 0,
    duration: 999,
    buffType: 'special',
  }],
}
