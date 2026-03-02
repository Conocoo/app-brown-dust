import type { Skill } from '../../types/skill'

/** 이로운 효과 금지 — 새로운 버프를 받을 수 없음, 6턴 */
export const buffBlock: Skill = {
  id: 'buff_block',
  name: '이로운 효과 금지',
  timing: 'after_attack',
  target: 'enemy_front',
  effects: [
    { type: 'buff_block', value: 0, duration: 6, debuffClass: 'stat_weaken' },
  ],
}
