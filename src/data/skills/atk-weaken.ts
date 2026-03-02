import type { Skill } from '../../types/skill'

/** 공격력 감소 — 적 공격력 -50%, 24턴 */
export const atkWeaken: Skill = {
  id: 'atk_weaken',
  name: '공격력 감소',
  timing: 'before_attack',
  target: 'enemy_front',
  effects: [
    { type: 'atk_down', value: 50, duration: 24, debuffClass: 'stat_weaken' },
  ],
}
