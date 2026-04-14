// 사망 체인 로직
// 명세: Docs/명세/전투/10-사망-생존.md

import type { BattleCharacter, BattleLogEntry } from '../types/battle'
import type { BuffInstance } from './buff'
import { applyBuffToChar } from './buff'
import { getBuffByCode } from '../data/buffs'

// ─── 사망 체인 결과 ───────────────────────────────────────

export type DeathResult =
  | { survived: true;  reason: 'hp_positive' | 'instead_death' | 'rebirth' | 'revival' }
  | { survived: false; reason: 'dead' }

// ─── 사망 판정 ────────────────────────────────────────────

export function isDead(char: BattleCharacter): boolean {
  return char.hp <= 0
}

// ─── 후속 버프 적용 (linkedBuffs) ─────────────────────────

/**
 * 버프의 linkedBuffs(addBuff1, addBuff2)를 대상에게 적용.
 * 명세: InsteadDeath/RebirthBuff 발동 후 CreateBuffProcess 호출.
 */
function applyLinkedBuffs(
  char: BattleCharacter,
  buff: BuffInstance,
  log: BattleLogEntry[]
): void {
  const linked = buff.data.linkedBuffs
  if (!linked) return

  const codes = [linked.addBuff1, linked.addBuff2].filter(c => c !== 0)
  for (const code of codes) {
    const buffData = getBuffByCode(code)
    if (!buffData) continue
    const applied = applyBuffToChar(char, buffData, buff.creatorKey)
    if (applied) {
      log.push({
        type: 'buff_applied',
        charKey: char.key,
        buffCode: code,
        detail: `후속 버프 적용 (버프: ${code})`,
      })
    }
  }
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

    // 후속 버프 적용 (linkedBuffs)
    applyLinkedBuffs(char, buff, log)

    if (buff.data.useType === 0) {
      // useType=0: 1회용 — 버프 제거
      char.activeBuffs = char.activeBuffs.filter(b => b !== buff)
    }
    // useType=1 (또는 기타): 버프 유지

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
    type: 'rebirth',
    charKey: char.key,
    restoreHp: char.hp,
    detail: `환생 발동 (버프: ${buff.buffCode}) → HP ${char.maxHp} 회복, 버프 초기화`,
  })

  // 후속 버프 적용 (linkedBuffs) — 버프 초기화 후 적용
  applyLinkedBuffs(char, buff, log)

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

// ─── DiedBuff: 사망 시 자신에게 linkedBuffs 적용 ────────

/**
 * classType='DiedBuff' 버프를 가진 캐릭터가 사망할 때,
 * 해당 버프의 linkedBuffs를 자기 자신에게 적용.
 * (사망 확정 전에 호출 — activeBuffs가 아직 남아 있는 상태)
 */
function processDiedBuff(
  char: BattleCharacter,
  log: BattleLogEntry[]
): void {
  const diedBuffs = char.activeBuffs.filter(
    b => b.data.classType === 'DiedBuff'
  )
  for (const buff of diedBuffs) {
    applyLinkedBuffs(char, buff, log)
  }
}

// ─── DiedAdd: 사망 시 공격자에게 linkedBuffs 적용 ───────

/**
 * classType='DiedAdd' 버프를 가진 캐릭터가 사망할 때,
 * 해당 버프의 linkedBuffs를 공격자(attacker)에게 적용.
 */
function processDiedAdd(
  char: BattleCharacter,
  attacker: BattleCharacter | null,
  log: BattleLogEntry[]
): void {
  if (!attacker || attacker.hp <= 0) return

  const diedAddBuffs = char.activeBuffs.filter(
    b => b.data.classType === 'DiedAdd'
  )
  for (const buff of diedAddBuffs) {
    const linked = buff.data.linkedBuffs
    if (!linked) continue

    const codes = [linked.addBuff1, linked.addBuff2].filter(c => c !== 0)
    for (const code of codes) {
      const buffData = getBuffByCode(code)
      if (!buffData) continue
      const applied = applyBuffToChar(attacker, buffData, buff.creatorKey)
      if (applied) {
        log.push({
          type: 'buff_applied',
          charKey: attacker.key,
          buffCode: code,
          detail: `사망 반응 버프 적용: ${char.name} 사망 → ${attacker.name}에게 버프 ${code}`,
        })
      }
    }
  }
}

// ─── OtherDiedAdd: 아군 사망 시 생존 아군에게 linkedBuffs 적용 ─

/**
 * classType='OtherDiedAdd' 버프를 가진 생존 아군이 있으면,
 * 아군 사망 시 해당 버프의 linkedBuffs를 자신에게 적용.
 * turn.ts에서 사망 확정 후 호출.
 */
export function processOtherDiedAdd(
  deadChar: BattleCharacter,
  allies: BattleCharacter[],
  log: BattleLogEntry[]
): void {
  for (const ally of allies) {
    if (ally.hp <= 0 || ally.key === deadChar.key) continue

    const otherDiedBuffs = ally.activeBuffs.filter(
      b => b.data.classType === 'OtherDiedAdd'
    )
    for (const buff of otherDiedBuffs) {
      applyLinkedBuffs(ally, buff, log)
    }
  }
}

// ─── 5단계 사망 체인 메인 ────────────────────────────────

/**
 * ProcessDieCheck: 5단계 사망 체인 실행.
 * 명세 §2 전체 흐름도.
 *
 * @param char          피격 캐릭터 (hp가 이미 차감된 상태)
 * @param isDelayDamage 지연 데미지 여부 (true면 대신죽기/환생 건너뜀)
 * @param log           로그 배열
 * @param attacker      공격자 (DiedAdd 처리용, 없으면 null)
 */
export function processDieCheck(
  char: BattleCharacter,
  isDelayDamage: boolean,
  log: BattleLogEntry[],
  attacker: BattleCharacter | null = null
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

  // [3] 사망 콜백: DiedBuff (자신에게), DiedAdd (공격자에게)
  processDiedBuff(char, log)
  processDiedAdd(char, attacker, log)

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
