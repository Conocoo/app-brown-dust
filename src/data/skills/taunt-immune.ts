import type { Skill } from '../../types/skill'

/** 도발 무시 — 적의 도발을 무시하고 원래 타겟 방식대로 공격 */
export const tauntImmune: Skill = {
  id: 'taunt_immune',
  name: '도발 무시',
  timing: 'passive',
  target: 'self',
  effects: [
    { type: 'taunt_immune', value: 0, duration: 999 },
  ],
}
