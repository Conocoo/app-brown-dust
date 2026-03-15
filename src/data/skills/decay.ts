import type { Skill } from '../../types/skill'

/** 부패 — 매 턴 최대HP×2.5% 지속피해, 10턴, 중첩 가능 */
export const decay: Skill = {
  id: 'decay',
  name: '부패',
  timing: 'after_attack',
  target: 'enemy_front',
  effects: [{
    type: 'decay',
    value: 2.5,
    duration: 10,
    debuffClass: 'dot',
  }],
}
