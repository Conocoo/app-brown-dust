// 용병 정적 데이터 (mercenaries.json 기반)

export type CharacterType = 'attacker' | 'defender' | 'mage' | 'support'

/** mercenaries.json 한 항목 */
export interface MercenaryData {
  id: string
  name: string
  nameEn?: string
  type: CharacterType
  star: number
  finalStar?: number
  code: number
  skillCode: number
  maxHp: number
  /** 최대 레벨 기준 ATK */
  atk: number
  /** 방어율 % (정수, 예: 15 = 15%) */
  def: number
  /** 치명타 확률 % (정수, 예: 30 = 30%) */
  critRate: number
  /** 치명타 피해 % (정수, 예: 50 = 50%) */
  critDamage: number
  /** 회피율 % (정수) */
  agility: number
  /** 관통 % (정수) */
  piercing: number
  /** 인내 % (정수) */
  patience: number
  /** 지원력 (type=support 전용) */
  supportPower?: number
  maxLevel?: number
  baseLv1?: { atk: number; hp: number; supportPower: number }
  imageId: string
  emoji: string
}
