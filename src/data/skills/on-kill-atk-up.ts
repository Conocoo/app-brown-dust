import type { Skill } from '../../types/skill'

/** 공격력 증가 — 적 사망 시 공격력 +100%, 중첩 가능 */
export const onKillAtkUp: Skill = {
  id: 'on_kill_atk_up',
  name: '공격력 증가',
  timing: 'after_attack',
  target: 'self',
  effects: [
    { type: 'on_kill_atk_up', value: 100, duration: 24 },
  ],
}
