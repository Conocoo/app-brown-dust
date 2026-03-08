import type { CharacterType, AttackTargetType, AttackRange, Rune } from './game'
import type { SkillEffect } from './skill'

/** 성급 */
export type StarRating = 3 | 4 | 5

/** 용병별 스킬 참조 (효과 오버라이드 가능) */
export interface MercenarySkillRef {
  skillId: string
  /** 효과별 오버라이드 (인덱스 기준, 해당 인덱스의 숫자값만 덮어씀) */
  effects?: Partial<SkillEffect>[]
}

/** 용병 템플릿 */
export interface MercenaryTemplate {
  id: string
  name: string
  type: CharacterType
  star: StarRating
  maxHp: number
  atk: number
  /** 지원력 (지원형 전용). 회복/버프 스킬의 기본값 */
  supportPower?: number
  def: number
  emoji: string
  /** 이미지 파일 ID (char{imageId}icon.png) */
  imageId?: string
  /** 치명타 확률 (%) */
  critRate: number
  /** 치명타 추가 피해 (%). 기본 2x + critDamage/100 */
  critDamage: number
  /** 민첩 (0~100). 피격 시 스침(65% 데미지) 확률 + 데미지 감소 35% + 디버프 턴수 감소 50% */
  agility: number
  /** 스킬 1~4 (최대 4개), 스킬 ID + 효과 오버라이드 */
  skills: MercenarySkillRef[]
  /** 적 타겟 선택 방식 (기본: enemy_front) */
  attackTarget?: AttackTargetType
  /** 공격 범위 패턴 (기본: single) */
  attackRange?: AttackRange
  /** 범위 크기 (horizontal, vertical, back_n 등에서 사용) */
  rangeSize?: number
  /** 장착된 룬 목록 (최대 2개) */
  runes?: Rune[]
  /** 자폭: 턴 종료 후 자신 즉사 */
  selfDestruct?: boolean
}
