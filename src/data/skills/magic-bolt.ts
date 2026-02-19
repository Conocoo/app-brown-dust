import type { Skill } from '../../types/skill'

/** 마법 화살 (mage용) */
export const magicBolt: Skill = {
  id: 'magic_bolt',
  name: '마법 화살',
  timing: 'before_attack',
  target: 'enemy_front',
  effects: [{ type: 'damage', value: 1.0 }],
}
