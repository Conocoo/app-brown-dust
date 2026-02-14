/** 캐릭터 유형 (4종) */
export type CharacterType = 'attacker' | 'defender' | 'support' | 'mage'

/** 캐릭터 기본 정보 (템플릿) */
export interface CharacterTemplate {
  id: string
  name: string
  type: CharacterType
  maxHp: number
  atk: number
  def: number
  emoji: string
}

/** 전투 중 캐릭터 상태 */
export interface BattleCharacter {
  templateId: string
  name: string
  type: CharacterType
  hp: number
  maxHp: number
  atk: number
  def: number
  emoji: string
  team: 'player' | 'enemy'
  row: number
  col: number
  /** 마법형 캐스팅 상태 */
  isCasting: boolean
  /** 행동 순서 (0부터 시작) */
  order: number
}

/** 전투 로그 종류 */
export type BattleLogType = 'attack' | 'casting' | 'support' | 'round_start'

/** 전투 로그 한 줄 */
export interface BattleLogEntry {
  type: BattleLogType
  round?: number
  attacker?: string
  attackerTeam?: 'player' | 'enemy'
  defender?: string
  damage?: number
  defenderHpAfter?: number
  defenderMaxHp?: number
  defeated?: boolean
  message?: string
}

/** 게임 상태 */
export type GamePhase = 'placing' | 'ordering' | 'battling' | 'result'
