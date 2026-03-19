import type { BuffType, DebuffClass, AttackTargetType, AttackRange } from './game'

/** 스킬 발동 시점 */
export type SkillTiming = 'before_attack' | 'after_attack' | 'passive'

/** 스킬 대상 선택 */
export type SkillTargetType = AttackTargetType | 'next_ally' | 'self'

/** 스킬 개별 효과 */
export interface SkillEffect {
  type: string
  value: number
  /** 이 효과에만 적용할 대상 오버라이드 (없으면 CharacterSkill.target 사용) */
  target?: SkillTargetType
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
  /** 효과 채널: multiply(승산) vs plus(가산). 미지정 시 multiply */
  channel?: 'multiply' | 'plus'
  /** 카운트 가드 등 횟수 기반 효과의 초기 횟수 */
  count?: number
}

/** 용병 캐릭터 스킬 (용병당 1개, 게임 원본 SkillBasicList 구조 반영) */
export interface CharacterSkill {
  /** 스킬명 (UI 표시용) */
  name?: string
  timing: SkillTiming
  /** 기본 대상 (개별 효과에서 target 오버라이드 가능) */
  target: SkillTargetType
  attackRange: AttackRange
  rangeSize?: number
  effects: SkillEffect[]
}

/** 스킬 정의 (트리거 효과용 템플릿) */
export interface Skill {
  id: string
  name: string
  timing: SkillTiming
  target: SkillTargetType
  effects: SkillEffect[]
}
