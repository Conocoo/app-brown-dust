import type { Skill } from '../../types/skill'

/** 보호막 — 자신에게 받는 피해량 -25%, 12턴 */
export const shield: Skill = {
  id: 'shield',
  name: '보호막',
  timing: 'after_attack',
  target: 'self',
  effects: [{ type: 'shield', value: 25, duration: 12, buffType: 'shield' }],
}
