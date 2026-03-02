import type { Skill } from '../../types/skill'

/** 상급 화상 — 매 턴 ATK×25% 지속피해 + 받는 피해량 +20%, 5턴, 중첩 가능 */
export const advancedBurn: Skill = {
  id: 'advanced_burn',
  name: '상급 화상',
  timing: 'after_attack',
  target: 'enemy_front',
  effects: [{
    type: 'advanced_burn',
    value: 25,
    atkScaling: true,
    duration: 5,
    debuffClass: 'dot',
    dmgTakenUp: 20,
  }],
}
