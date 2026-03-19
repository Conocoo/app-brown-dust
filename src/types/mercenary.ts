import type { CharacterType, Rune } from './game'
import type { CharacterSkill } from './skill'

/** 성급 */
export type StarRating = 3 | 4 | 5

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
  /** 피해 감소 (0~100). 가변 데미지에만 적용. 방어와 독립. 기본 0 */
  damageReduce?: number
  /** 캐릭터 스킬 (1개, 게임 원본 SkillBasicList 반영) */
  skill: CharacterSkill
  /** 장착된 룬 목록 (최대 2개) */
  runes?: Rune[]
  /** 자폭: 턴 종료 후 자신 즉사 */
  selfDestruct?: boolean
}
