import type { Skill } from '../../types/skill'

/** 중독 — 매 턴 ATK×12% 지속피해, 6턴, 공격형 3배, 중첩 가능 */
export const poison: Skill = {
  id: 'poison',
  name: '중독',
  timing: 'before_attack',
  target: 'enemy_front',
  effects: [{
    type: 'poison',
    value: 12,
    atkScaling: true,
    duration: 6,
    debuffClass: 'dot',
  }],
}
