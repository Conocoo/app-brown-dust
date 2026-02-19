import type { CharacterType } from './game'

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
  def: number
  emoji: string
  /** 치명타 확률 (%) */
  critRate: number
  /** 치명타 추가 피해 (%). 기본 2x + critDamage/100 */
  critDamage: number
  /** 스침 확률 (%). 발동 시 65% 데미지만 적중 */
  grazeRate: number
  /** 스킬 1~4 (최대 4개), 스킬 ID로 참조 */
  skillIds: string[]
}
