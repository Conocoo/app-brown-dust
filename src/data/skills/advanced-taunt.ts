import type { Skill } from '../../types/skill'

/** 상급 도발 — 도발(12턴) + 받는 피해량 -35% */
export const advancedTaunt: Skill = {
  id: 'advanced_taunt',
  name: '상급 도발',
  timing: 'after_attack',
  target: 'self',
  effects: [
    { type: 'taunt', value: 0, duration: 12, buffType: 'special' },
    { type: 'shield', value: 35, duration: 12, buffType: 'shield' },
  ],
}
