/** 스킬 발동 시점 */
export type SkillTiming = 'before_attack' | 'after_attack' | 'passive'

/** 스킬 대상 선택 */
export type SkillTargetType = 'enemy_front' | 'next_ally' | 'self'

/** 스킬 개별 효과 */
export interface SkillEffect {
  type: string
  value: number
}

/** 스킬 정의 */
export interface Skill {
  id: string
  name: string
  timing: SkillTiming
  target: SkillTargetType
  effects: SkillEffect[]
}
