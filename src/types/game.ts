/** 캐릭터 유형 (4종) */
export type CharacterType = 'attacker' | 'defender' | 'support' | 'mage'

/** 버프 분류 (제거 규칙 결정) */
export type BuffType = 'shield' | 'stat_enhance' | 'special'

/** 디버프 분류 (면역 판정 기준) */
export type DebuffClass = 'cc' | 'dot' | 'stat_weaken'

/** 적 타겟 선택 방식 (용병 단위) */
export type AttackTargetType = 'enemy_front' | 'enemy_second' | 'enemy_back' | 'enemy_random'

/** 공격 범위 패턴 (용병 단위) */
export type AttackRange = 'single' | 'horizontal' | 'vertical' | 'back_n' | 'front_n'
  | 'cross' | 'x_shape' | 'area_n' | 'diamond'

/** 상태 효과 */
export interface StatusEffect {
  id: string
  type: string
  value: number
  remainingTurns: number
  category: 'buff' | 'debuff'
  buffType?: BuffType
  debuffClass?: DebuffClass
  /** true면 해로운효과 면역 관통 */
  ignoreImmunity?: boolean
  /** 부가 효과: 받는 피해량 증가 (%). 복합 상태효과에서 사용 */
  dmgTakenUp?: number
}

/** 전투 중 캐릭터 상태 */
export interface BattleCharacter {
  templateId: string
  name: string
  type: CharacterType
  hp: number
  maxHp: number
  atk: number
  /** 지원력 (지원형 전용). 회복/버프 스킬의 기본값 */
  supportPower: number
  def: number
  emoji: string
  imageId?: string
  critRate: number
  critDamage: number
  /** 민첩 (피격 시 스침 확률 + 데미지 감소 35% + 디버프 턴수 감소 50%) */
  agility: number
  team: 'player' | 'enemy'
  row: number
  col: number
  /** 마법형 캐스팅 상태 */
  isCasting: boolean
  /** 행동 순서 (0부터 시작) */
  order: number
  /** 스킬 ID 목록 */
  skillIds: string[]
  /** 적 타겟 선택 방식 */
  attackTarget: AttackTargetType
  /** 공격 범위 패턴 */
  attackRange: AttackRange
  /** 범위 크기 (horizontal, vertical, back_n, front_n, cross, area_n 등에서 사용) */
  rangeSize?: number
  /** 현재 걸린 상태 효과 */
  statusEffects: StatusEffect[]
  /** 장착된 룬 (스탯 재계산 시 사용) */
  runes: Rune[]
}

/** 전투 로그 종류 */
export type BattleLogType = 'attack' | 'casting' | 'support' | 'round_start' | 'buff' | 'debuff' | 'immune' | 'reflect' | 'status_update'

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
  /** 스킬명 (없으면 일반공격) */
  skillName?: string
  /** 치명타 발동 여부 */
  isCritical?: boolean
  /** 스침 발동 여부 */
  isGraze?: boolean
  /** 상태 변화 대상 식별자 (team-templateId 형식) */
  targetKey?: string
  /** 변화 후 대상의 statusEffects 스냅샷 */
  targetStatusEffects?: StatusEffect[]
}

/** 게임 상태 */
export type GamePhase = 'placing' | 'ordering' | 'battling' | 'result'

// ─── 룬 시스템 ────────────────────────────────────────────────────────────────

/** 룬 스탯 종류 (7종) */
export type RuneStat =
  | 'hp_percent' | 'hp_flat'
  | 'atk_percent' | 'atk_flat'
  | 'def' | 'crit_rate' | 'crit_damage'

export interface RuneOption {
  stat: RuneStat
  value: number
}

export interface Rune {
  id: string
  type: 'single' | 'dual'
  /** 메인 옵션 (단일: 100%, 듀얼: 55%) */
  main: RuneOption
  /** 듀얼 룬 전용 두 번째 메인 옵션 (50%) */
  main2?: RuneOption
  /** 부가 옵션 */
  sub?: RuneOption
}
