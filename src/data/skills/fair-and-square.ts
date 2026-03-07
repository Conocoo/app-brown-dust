import type { Skill } from '../../types/skill'

/** 임시생명력(시전자maxHP×SP×100%) + 공격력 증가(SP×85%), 연동 */
export const fairAndSquare: Skill = {
  id: 'fair_and_square',
  name: '정정당당',
  timing: 'after_attack',
  target: 'next_ally',
  effects: [
    { type: 'temp_hp', value: 100, spScaling: true, duration: 16, buffType: 'stat_enhance', linkedBuffId: 'atk_up' },
    { type: 'atk_up', value: 85, spScaling: true, duration: 16, buffType: 'stat_enhance' },
  ],
}
