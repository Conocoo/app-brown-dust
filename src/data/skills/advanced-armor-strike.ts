import type { Skill } from '../../types/skill'

/** 상급 철갑의 필격 — DEF×ATK×275% 추가피해 */
export const advancedArmorStrike: Skill = {
  id: 'advanced_armor_strike',
  name: '상급 철갑의 필격',
  timing: 'after_attack',
  target: 'enemy_front',
  effects: [
    { type: 'def_scaling_damage', value: 275 },
  ],
}
