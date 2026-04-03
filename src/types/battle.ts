// 전투 런타임 타입 정의
// 명세: Docs/명세/전투/02-데이터-모델.md, 04-전투-흐름.md

import type { CharacterType } from './character'
import type { RuneSlots } from './rune'
import type { BuffInstance } from '../logic/buff'

/** 전투 중 캐릭터 런타임 상태 */
export interface BattleCharacter {
  /** 고유 키: "{team}_{id}_{counter}" */
  key: string
  id: string
  name: string
  type: CharacterType
  team: 'A' | 'B'
  row: number
  col: number
  /** 현재 HP */
  hp: number
  maxHp: number
  /** 현재 ATK (버프 적용 전 기본값) */
  atk: number
  /** 지원력 */
  supportPower: number
  /** 방어율 % */
  def: number
  /** 치명타 확률 % */
  critRate: number
  /** 치명타 피해 % */
  critDamage: number
  /** 회피율 % */
  agility: number
  /** 관통 % */
  piercing: number
  /** 인내 % */
  patience: number
  /** 활성 버프 목록 */
  activeBuffs: BuffInstance[]
  /** 공격 순서 인덱스 */
  order: number
  /** 현재 캐스팅 중 (마법사 1턴 대기) */
  isCasting: boolean
  /** 스킬 런타임 정보 목록 */
  skills: BattleSkillInfo[]
  /** 스킬별 쿨타임 카운터 (skillCode → 현재 쿨 카운트) */
  coolTimeCounters: Record<number, number>
  /** 임시 HP (보호막 등) */
  tempHp: number
  imageId: string
  emoji: string
  /** 장착 룬 */
  runes: RuneSlots
}

/** 전투 중 스킬 정보 (스킬 로직 실행에 필요한 최소 데이터) */
export interface BattleSkillInfo {
  skillCode: number
  coolTimeCount: number
  repeatCount: number
  searchType: number
  rangeType: number
  rangeSize: number
}

// ─── 전투 로그 ───────────────────────────────────────────

export type BattleLogType =
  | 'round_start'
  | 'turn_start'
  | 'casting'
  | 'attack'
  | 'skill_effect'
  | 'buff_applied'
  | 'buff_expired'
  | 'dot_damage'
  | 'dot_heal'
  | 'death'
  | 'revival'
  | 'instead_death'
  | 'battle_end'

export interface BattleLogEntry {
  type: BattleLogType
  /** 행동한 캐릭터 key */
  charKey: string
  /** 대상 캐릭터 key */
  targetKey?: string
  /** 데미지 수치 */
  damage?: number
  /** 치명타 여부 */
  isCritical?: boolean
  /** 스침 여부 */
  isDodge?: boolean
  /** 버프 코드 */
  buffCode?: number
  /** HP 회복량 (부활/대신죽기 시 회복 후 HP) */
  restoreHp?: number
  /** 설명 텍스트 */
  detail?: string
}
