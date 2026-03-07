import type { Skill } from '../../types/skill'

/** 공격력 증가(SP×85%) + 치명확률 증가(SP×20%), 12턴 */
export const advancedAtkUp: Skill = {
  id: 'advanced_atk_up',
  name: '상급 공격력 증가 부여',
  timing: 'after_attack',
  target: 'next_ally',
  effects: [
    { type: 'atk_up', value: 85, spScaling: true, duration: 12, buffType: 'stat_enhance' },
    { type: 'crit_up', value: 20, spScaling: true, duration: 12, buffType: 'stat_enhance' },
  ],
}
