import type { Skill } from '../../types/skill'

/** 강타 1~4 — 1.2배 추가 공격 (더미) */
export const powerStrike1: Skill = {
  id: 'power_strike_1',
  name: '강타1',
  timing: 'after_attack',
  target: 'enemy_front',
  effects: [{ type: 'damage', value: 1.2 }],
}

export const powerStrike2: Skill = {
  id: 'power_strike_2',
  name: '강타2',
  timing: 'after_attack',
  target: 'enemy_front',
  effects: [{ type: 'damage', value: 1.2 }],
}

export const powerStrike3: Skill = {
  id: 'power_strike_3',
  name: '강타3',
  timing: 'before_attack',
  target: 'enemy_front',
  effects: [{ type: 'damage', value: 1.2 }],
}

export const powerStrike4: Skill = {
  id: 'power_strike_4',
  name: '강타4',
  timing: 'before_attack',
  target: 'enemy_front',
  effects: [{ type: 'damage', value: 1.2 }],
}
