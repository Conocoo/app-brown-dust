import type { Skill } from '../../types/skill'

/** 무효화 — 적 버프 제거 (단순 제거, 연쇄 없음) */
export const dispelSkill: Skill = {
  id: 'dispel_skill',
  name: '무효화',
  timing: 'after_attack',
  target: 'enemy_front',
  effects: [
    { type: 'dispel', value: 0 },
  ],
}
