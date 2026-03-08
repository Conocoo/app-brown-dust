import type { Skill } from '../../types/skill'

/** 저주 — 생명력 제외 모든 능력치 -65%, 18턴 */
export const curseSkill: Skill = {
  id: 'curse_skill',
  name: '저주',
  timing: 'before_attack',
  target: 'enemy_front',
  effects: [
    { type: 'atk_down', value: 65, duration: 18, debuffClass: 'stat_weaken' },
    { type: 'def_down', value: 65, duration: 18, debuffClass: 'stat_weaken' },
    { type: 'crit_rate_down', value: 65, duration: 18, debuffClass: 'stat_weaken' },
    { type: 'crit_damage_down', value: 65, duration: 18, debuffClass: 'stat_weaken' },
    { type: 'agility_down', value: 65, duration: 18, debuffClass: 'stat_weaken' },
  ],
}
