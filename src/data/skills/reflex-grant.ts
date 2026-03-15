import type { Skill } from '../../types/skill'

/** 반사 신경 부여 — 민첩 +50%(지원력 비례), 피격 시 방어력 증가 트리거, 약탈/복사 면역 */
export const reflexGrant: Skill = {
  id: 'reflex_grant',
  name: '반사 신경 부여',
  timing: 'after_attack',
  target: 'next_ally',
  effects: [
    { type: 'agility_up', value: 50, spScaling: true, duration: 12, buffType: 'stat_enhance', ignoreImmunity: true },
    { type: 'on_hit_def_up', value: 0, duration: 12, buffType: 'special' },
  ],
}
