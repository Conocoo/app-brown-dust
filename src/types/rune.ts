// 룬 타입 정의 (runes.json 기반)
// 슬롯 3개, 스탯 11종

/** 룬 스탯 종류 */
export type RuneStatType =
  | 'atk_flat'
  | 'atk_percent'
  | 'hp_flat'
  | 'hp_percent'
  | 'def_percent'
  | 'crit_rate'
  | 'crit_damage'
  | 'agility'
  | 'patience'
  | 'piercing'
  | 'support_power'

/** runes.json 원본 룬 데이터 */
export interface RuneData {
  code: number
  star: number
  grade: number
  mythology: boolean
  type: 'single' | 'set'
  equipType: number
  equipTypeLabel: string
  main: {
    stat: RuneStatType
    value: number
  }
  growIndex: number
  usableCharStar: number
}

/** 장착된 룬 슬롯 (최대 3개) */
export interface EquippedRune {
  runeCode: number
  /** 강화 레벨 */
  level: number
}

/** 용병의 룬 슬롯 3개 */
export type RuneSlots = [
  EquippedRune | null,
  EquippedRune | null,
  EquippedRune | null,
]
