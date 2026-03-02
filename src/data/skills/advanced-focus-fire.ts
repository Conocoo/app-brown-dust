import type { Skill } from '../../types/skill'

/** 상급 일점사 — 일점사(타겟 집중) + 모든 능력치 -30%, 6턴 */
export const advancedFocusFire: Skill = {
  id: 'advanced_focus_fire',
  name: '상급 일점사',
  timing: 'after_attack',
  target: 'enemy_front',
  effects: [
    { type: 'focus_fire', value: 0, duration: 6, debuffClass: 'stat_weaken' },
    { type: 'atk_down', value: 30, duration: 6, debuffClass: 'stat_weaken' },
    { type: 'def_down', value: 30, duration: 6, debuffClass: 'stat_weaken' },
    { type: 'crit_rate_down', value: 30, duration: 6, debuffClass: 'stat_weaken' },
    { type: 'crit_damage_down', value: 30, duration: 6, debuffClass: 'stat_weaken' },
    { type: 'agility_down', value: 30, duration: 6, debuffClass: 'stat_weaken' },
  ],
}
