// 버프 타입 정의 (buffs.json 기반)
// 명세: Docs/명세/전투/08-버프.md

/** buffs.json 원본 버프 정의 */
export interface BuffData {
  code: number
  classType: string
  /** 'buff' | 'debuff' */
  category: 'buff' | 'debuff'
  categoryRaw: number
  /** 세부 효과 종류 (65종+) */
  subType: number
  /** 1=아군, 2=적 */
  targetType: number
  /** 0=전체, 1=메인, 2=서브 */
  applyType: number
  checkTargetType: number
  /** 지속 턴 (1000=영구) */
  turn: number
  turnType: number
  /** GetMagicValue 모드 (0~26) */
  valueBaseType: number
  valueStatType: number
  magicValue1: number
  magicValue2: number
  /** 중첩 가능 횟수 (0=중복 불가) */
  overLap: number
  /** 면역 무시 비트마스크 */
  ignoreType: number
  operateType: number
  /** 발동 시점 (0=후, 1=패시브, 2=전, 4=자동) */
  useType: number
  diedActionType: number
  copyActionType: number
  /** 같은 groupCode끼리 중복 불가 (0=그룹 없음) */
  groupCode: number
  linkedBuffs: number[] | null
  tooltipKr?: string
  tooltipEn?: string
  buffEffect?: string
}

/** 런타임 활성 버프 인스턴스 */
export interface ActiveBuff {
  /** 버프 정의 코드 */
  buffCode: number
  /** 버프 정적 데이터 참조 */
  data: BuffData
  /** 남은 지속 턴 */
  remainingTurns: number
  /** 계산된 실제 효과 수치 */
  computedValue: number
  /** 버프를 건 캐릭터 key (team-id) */
  creatorKey: string
  /** 버프를 받은 캐릭터 key */
  ownerKey: string
  /** 인스턴스 고유 ID */
  instanceId: string
}
