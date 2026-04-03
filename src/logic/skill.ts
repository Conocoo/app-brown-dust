// 스킬 실행 엔진
// 명세: Docs/명세/전투/06-스킬-실행.md

import type { BattleCharacter } from '../types/battle'

// ─── 쿨타임 관리 ──────────────────────────────────────────

/**
 * 쿨타임 카운터 초기화 (전투 시작 또는 스킬 발동 후).
 * 명세 §4.2, §4.6
 */
export function initCoolTime(char: BattleCharacter, skillCode: number): void {
  char.coolTimeCounters[skillCode] = 0
}

/**
 * 쿨타임 카운터 +1 증가.
 * 명세 §4.3
 */
export function plusCoolTimeCount(char: BattleCharacter, skillCode: number): void {
  char.coolTimeCounters[skillCode] = (char.coolTimeCounters[skillCode] ?? 0) + 1
}

/**
 * 스킬 발동 가능 여부.
 * coolTimeCount=0 → 항상 발동 가능.
 * coolTimeCount>0 → 카운터 >= 요구치이면 발동.
 * 명세 §4.4
 */
export function isTurnSkillUse(
  char: BattleCharacter,
  skillCode: number,
  coolTimeCount: number
): boolean {
  if (coolTimeCount === 0) return true
  const counter = char.coolTimeCounters[skillCode] ?? 0
  return counter >= coolTimeCount
}

/**
 * 스킬 발동 여부 종합 체크.
 * - 기절(stunned): 항상 false
 * - 침묵(silenced): useType=0,2 스킬 false (after_attack, before_attack 불가)
 * - coolTimeCount: 충전 체크
 */
export function canUseSkill(
  char: BattleCharacter,
  skillCode: number,
  coolTimeCount: number,
  useType: number,
  isStunned: boolean,
  isSilenced: boolean
): boolean {
  if (isStunned) return false
  // 침묵(silenced): passive(useType=1), turn_start(useType=4) 스킬은 영향 없음
  if (isSilenced && (useType === 0 || useType === 2)) return false
  return isTurnSkillUse(char, skillCode, coolTimeCount)
}

// ─── 반복 공격 ────────────────────────────────────────────

/**
 * 반복 공격 횟수 반환.
 * repeatCount=0 → 1회, repeatCount=N → N회.
 * 명세 §3.2
 */
export function getRepeatCount(repeatCount: number): number {
  return Math.max(1, repeatCount)
}

// ─── useType별 스킬 분류 ─────────────────────────────────

/** useType 정의 */
export const USE_TYPE = {
  AFTER_ATTACK: 0,    // 공격 후
  PASSIVE: 1,         // 전투 시작 시 (패시브)
  BEFORE_ATTACK: 2,   // 공격 전
  TURN_START: 4,      // 매 턴 시작
} as const

/** useType으로 발동 타이밍 확인 */
export function isPassiveSkill(useType: number): boolean {
  return useType === USE_TYPE.PASSIVE
}

export function isBeforeAttackSkill(useType: number): boolean {
  return useType === USE_TYPE.BEFORE_ATTACK
}

export function isAfterAttackSkill(useType: number): boolean {
  return useType === USE_TYPE.AFTER_ATTACK
}

export function isTurnStartSkill(useType: number): boolean {
  return useType === USE_TYPE.TURN_START
}

// ─── 캐스팅 상태 ──────────────────────────────────────────

/**
 * 캐스팅 중 여부 (coolTimeCount > 0이고 아직 충전 안 된 상태).
 * 명세 §4.5
 */
export function isCastingState(
  char: BattleCharacter,
  skillCode: number,
  coolTimeCount: number
): boolean {
  if (coolTimeCount === 0) return false
  const counter = char.coolTimeCounters[skillCode] ?? 0
  return counter < coolTimeCount
}

// ─── 스킬 실행 후 처리 ────────────────────────────────────

/**
 * 스킬 발동 완료 후 쿨타임 리셋.
 * 명세 §4.6
 */
export function onSkillUsed(char: BattleCharacter, skillCode: number): void {
  initCoolTime(char, skillCode)
}
