import type { BuffType, DebuffClass, AttackTargetType } from './game'

/** 스킬 발동 시점 */
export type SkillTiming = 'before_attack' | 'after_attack' | 'passive'

/** 스킬 대상 선택 (enemy 계열은 실행 시 용병의 attackTarget으로 대체됨) */
export type SkillTargetType = AttackTargetType | 'next_ally' | 'self'

/** 스킬 개별 효과 */
export interface SkillEffect {
  type: string
  value: number
  /** 지속 턴 수 (없으면 즉시 효과) */
  duration?: number
  /** 버프 분류 (shield/stat_enhance/special) */
  buffType?: BuffType
  /** 디버프 분류 (cc/dot/stat_weaken) */
  debuffClass?: DebuffClass
  /** true면 해로운효과 면역 관통 */
  ignoreImmunity?: boolean
  /** true면 value를 시전자 ATK의 %로 계산 (예: value 25 → ATK × 25%) */
  atkScaling?: boolean
  /** true면 value를 시전자 지원력의 %로 계산 (예: value 85 → supportPower × 85%) */
  spScaling?: boolean
  /** 부가 효과: 받는 피해량 증가 (%). 상태효과에 함께 저장됨 */
  dmgTakenUp?: number
  /** 이 효과 적용 후 연쇄 발동할 스킬 ID */
  triggerSkill?: string
  /** 이 효과 제거 시 함께 제거할 상태효과 type */
  linkedBuffId?: string
}

/** 스킬 정의 */
export interface Skill {
  id: string
  name: string
  timing: SkillTiming
  target: SkillTargetType
  effects: SkillEffect[]
}
