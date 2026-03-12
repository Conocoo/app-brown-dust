import type { Skill } from '../../types/skill'

/** 화상 — 매 턴 ATK×4% 지속피해, 5턴, 중첩 가능 */
export const burn: Skill = {
  id: 'burn',
  name: '화상',
  timing: 'after_attack',
  target: 'enemy_front',
  effects: [{
    type: 'burn',
    value: 4,
    atkScaling: true,
    duration: 5,
    debuffClass: 'dot',
  }],
}
