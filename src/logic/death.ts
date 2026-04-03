// 사망 체인 로직
// 명세: Docs/명세/전투/10-사망-생존.md

import type { BattleCharacter, BattleLogEntry } from '../types/battle'
import type { BuffInstance } from './buff'

// ─── 사망 체인 결과 ───────────────────────────────────────

export type DeathResult =
  | { survived: true;  reason: 'hp_positive' | 'instead_death' | 'rebirth' | 'revival' }
  | { survived: false; reason: 'dead' }

// ─── 사망 판정 ────────────────────────────────────────────

export function isDead(char: BattleCharacter): boolean {
  return char.hp <= 0
}

// ─── 대신죽기 (InsteadDeath) ─────────────────────────────

/**
 * insteadDeath 버프 발동.
 * HP 100% 회복 + 버프 소모(useType=0) 또는 유지(useType=1).
 * 명세 §2.1
 */
export function processInsteadDeath(
  char: BattleCharacter,
  insteadDeathBuffs: BuffInstance[],
  log: BattleLogEntry[]
): boolean {
  if (insteadDeathBuffs.length === 0) return false

  for (const buff of insteadDeathBuffs) {
    // HP 100% 회복
    char.hp = char.maxHp

    log.push({
      type: 'instead_death',
      charKey: char.key,
      restoreHp: char.hp,
      detail: `대신죽기 발동 (버프: ${buff.buffCode}) → HP ${char.maxHp} 회복`,
    })

    // useType=0: 버프 1회 소모 (End + remove)
    // useType=1: 버프 유지 (HP 회복만)
    // 실제 버프 제거는 battle.ts에서 담당 — 여기서는 플래그만 반환
    return true  // 생존
  }
  return false
}

// ─── 환생 (Rebirth) ──────────────────────────────────────

/**
 * rebirthList 첫 번째 버프 발동.
 * HP 회복 + 전체 버프 초기화.
 * 명세 §2.2
 */
export function processRebirth(
  char: BattleCharacter,
  rebirthBuffs: BuffInstance[],
  log: BattleLogEntry[]
): boolean {
  if (rebirthBuffs.length === 0) return false

  const buff = rebirthBuffs[0]

  // HP 회복 (부활 버프의 magicValue로 결정, 없으면 100%)
  char.hp = char.maxHp

  // 버프 전체 초기화 (환생은 ReBirth() 호출로 초기 상태 복원)
  char.activeBuffs = []

  log.push({
    type: 'revival',
    charKey: char.key,
    restoreHp: char.hp,
    detail: `환생 발동 (버프: ${buff.buffCode}) → HP ${char.maxHp} 회복, 버프 초기화`,
  })

  return true  // 생존
}

// ─── 부활 (Revival) ──────────────────────────────────────

/**
 * revivalList에서 발동 가능한 첫 번째 부활 버프 적용.
 * 명세 §2.4
 */
export function processRevival(
  char: BattleCharacter,
  revivalBuffs: BuffInstance[],
  log: BattleLogEntry[]
): boolean {
  if (revivalBuffs.length === 0) return false

  // 첫 번째 발동 가능한 부활 버프 사용
  const buff = revivalBuffs[0]

  // 부활 HP: magicValue1이 비율이면 maxHp * rate, 아니면 절대값
  const reviveHp = Math.round(char.maxHp * Math.min(1, buff.data.magicValue1))
  char.hp = Math.max(1, reviveHp)

  // 부활 성공 시에도 DiedAllBuff 실행 (모든 버프 해제)
  char.activeBuffs = []

  log.push({
    type: 'revival',
    charKey: char.key,
    restoreHp: char.hp,
    detail: `부활 발동 (버프: ${buff.buffCode}) → HP ${char.hp} 회복`,
  })

  return true
}

// ─── 5단계 사망 체인 메인 ────────────────────────────────

/**
 * ProcessDieCheck: 5단계 사망 체인 실행.
 * 명세 §2 전체 흐름도.
 *
 * @param char          피격 캐릭터 (hp가 이미 차감된 상태)
 * @param isDelayDamage 지연 데미지 여부 (true면 대신죽기/환생 건너뜀)
 * @param log           로그 배열
 */
export function processDieCheck(
  char: BattleCharacter,
  isDelayDamage: boolean,
  log: BattleLogEntry[]
): DeathResult {
  // HP > 0 → 생존
  if (char.hp > 0) {
    return { survived: true, reason: 'hp_positive' }
  }

  if (!isDelayDamage) {
    // [1] 대신죽기 체크
    const insteadDeathBuffs = char.activeBuffs.filter(
      b => b.data.subType === 0x05  // subType 5 = instead_death
    )
    if (processInsteadDeath(char, insteadDeathBuffs, log)) {
      return { survived: true, reason: 'instead_death' }
    }

    // [2] 환생 체크
    const rebirthBuffs = char.activeBuffs.filter(
      b => b.data.subType === 0x1E  // subType 30 = rebirth
    )
    if (processRebirth(char, rebirthBuffs, log)) {
      return { survived: true, reason: 'rebirth' }
    }
  }

  // [3] 사망 콜백 (battle.ts에서 처리)

  // [4] 부활 체크
  const revivalBuffs = char.activeBuffs.filter(
    b => b.data.subType === 0x06  // subType 6 = revival
  )
  if (processRevival(char, revivalBuffs, log)) {
    return { survived: true, reason: 'revival' }
  }

  // [5] 진짜 사망 — 버프 전체 해제
  char.activeBuffs = []
  char.hp = 0

  log.push({
    type: 'death',
    charKey: char.key,
    detail: `${char.name} 사망`,
  })

  return { survived: false, reason: 'dead' }
}

// ─── 즉사 (InstantDeath) ─────────────────────────────────

/**
 * ProcessInstantDeath: HP → 0, 대신죽기/환생/부활 모두 불가.
 * 명세 §5
 */
export function processInstantDeath(
  char: BattleCharacter,
  log: BattleLogEntry[]
): void {
  char.hp = 0
  char.activeBuffs = []

  log.push({
    type: 'death',
    charKey: char.key,
    detail: `${char.name} 즉사`,
  })
}

/**
 * ProcessInstantDeath2: HP → 0, 부활은 가능.
 * 명세 §5
 */
export function processInstantDeath2(
  char: BattleCharacter,
  log: BattleLogEntry[]
): DeathResult {
  char.hp = 0

  // 부활 시도
  const revivalBuffs = char.activeBuffs.filter(b => b.data.subType === 0x06)
  if (processRevival(char, revivalBuffs, log)) {
    return { survived: true, reason: 'revival' }
  }

  char.activeBuffs = []
  log.push({
    type: 'death',
    charKey: char.key,
    detail: `${char.name} 즉사2`,
  })

  return { survived: false, reason: 'dead' }
}
