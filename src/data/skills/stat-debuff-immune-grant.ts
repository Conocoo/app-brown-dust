import type { Skill } from '../../types/skill'

/** 아군에게 능력치 약화 면역, 8턴 */
export const statDebuffImmuneGrant: Skill = {
  id: 'stat_debuff_immune_grant',
  name: '능력치 약화 면역 부여',
  timing: 'before_attack',
  target: 'next_ally',
  effects: [
    { type: 'stat_debuff_immune', value: 0, duration: 8, buffType: 'special' },
  ],
}
