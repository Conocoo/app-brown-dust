import type { Skill } from '../../types/skill'

/** 축복 1~4 — 다음 순서 아군 최대 체력의 10% 회복 (더미) */
export const bless1: Skill = {
  id: 'bless_1',
  name: '축복1',
  timing: 'before_attack',
  target: 'next_ally',
  effects: [{ type: 'heal_percent', value: 10 }],
}

export const bless2: Skill = {
  id: 'bless_2',
  name: '축복2',
  timing: 'before_attack',
  target: 'next_ally',
  effects: [{ type: 'heal_percent', value: 10 }],
}

export const bless3: Skill = {
  id: 'bless_3',
  name: '축복3',
  timing: 'after_attack',
  target: 'next_ally',
  effects: [{ type: 'heal_percent', value: 10 }],
}

export const bless4: Skill = {
  id: 'bless_4',
  name: '축복4',
  timing: 'after_attack',
  target: 'next_ally',
  effects: [{ type: 'heal_percent', value: 10 }],
}
