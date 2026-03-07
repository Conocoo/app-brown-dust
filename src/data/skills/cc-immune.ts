import type { Skill } from '../../types/skill'

/** 공격 방해(CC) 스킬 면역, 8턴 */
export const ccImmune: Skill = {
  id: 'cc_immune',
  name: '공격 방해 면역',
  timing: 'before_attack',
  target: 'self',
  effects: [
    { type: 'cc_immune', value: 0, duration: 8, buffType: 'special' },
  ],
}
