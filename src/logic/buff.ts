// 버프 시스템 로직
// 명세: Docs/명세/전투/08-버프.md

import type { BuffData } from '../types/buff'
import type { BattleCharacter } from '../types/battle'

// ─── 런타임 버프 인스턴스 ─────────────────────────────────

export interface BuffInstance {
  instanceId: string
  buffCode: number
  data: BuffData
  ownerKey: string
  creatorKey: string
  currentTurn: number      // 경과 턴 (IsEndBuff: currentTurn >= maxTurn)
  overrideTurn: number     // 0이면 data.turn 사용
  damageValue: number      // 생성 시 전달된 데미지값
  isDodgeHit: boolean
  isCritical: boolean
  computedValue: number    // getMagicValue() 계산 결과 (캐시)
}

let _instanceCounter = 0

export function createBuffInstance(
  data: BuffData,
  ownerKey: string,
  creatorKey: string,
  options: {
    damageValue?: number
    isDodgeHit?: boolean
    isCritical?: boolean
    overrideTurn?: number
  } = {}
): BuffInstance {
  return {
    instanceId: `buff_${++_instanceCounter}`,
    buffCode: data.code,
    data,
    ownerKey,
    creatorKey,
    currentTurn: 0,
    overrideTurn: options.overrideTurn ?? 0,
    damageValue: options.damageValue ?? 0,
    isDodgeHit: options.isDodgeHit ?? false,
    isCritical: options.isCritical ?? false,
    computedValue: 0,
  }
}

// ─── 라이프사이클 ─────────────────────────────────────────

export function getMaxTurn(buff: BuffInstance): number {
  return buff.overrideTurn > 0 ? buff.overrideTurn : buff.data.turn
}

export function getRemainTurn(buff: BuffInstance): number {
  const max = getMaxTurn(buff)
  if (max >= 1000) return 1000  // 무한
  return Math.max(0, max - buff.currentTurn)
}

export function isEndBuff(buff: BuffInstance): boolean {
  const max = getMaxTurn(buff)
  if (max >= 1000) return false
  return buff.currentTurn >= max
}

/** 매 턴 Update — turnType이 일치할 때만 카운터 증가 */
export function updateBuff(buff: BuffInstance, turnType: number): void {
  if (buff.data.turnType === turnType) {
    buff.currentTurn += 1
  }
}

// ─── ignoreType 판정 ──────────────────────────────────────

/** 침묵 면역: ignoreType ∈ {1,3,5,7,9,11} */
export function isSilenceIgnore(ignoreType: number): boolean {
  if (ignoreType === 11) return true
  return ignoreType < 11 && (((1 << ignoreType) & 0x4AA) !== 0)
}

/** 반사 면역: ignoreType ∈ {2,3,6,7} */
export function isReflectIgnore(ignoreType: number): boolean {
  if (ignoreType === 7) return true
  return ignoreType < 7 && (((1 << ignoreType) & 0x4C) !== 0)
}

/** 초기 턴 리셋 면역: ignoreType ∈ {4,5,6,7,8,9,10} */
export function isInitTurnIgnore(ignoreType: number): boolean {
  return (ignoreType >= 4 && ignoreType <= 10) || ignoreType === 9
}

/** 복사 면역: ignoreType 8 or 9, 또는 actionType==1 && magicSource1==1 */
export function isCopyIgnore(ignoreType: number, actionType = 0, magicSource1 = 0): boolean {
  if ((ignoreType & ~3) === 8) return true
  if (actionType === 1 && magicSource1 === 1) return true
  return false
}

// ─── dupType 중복 관리 ────────────────────────────────────

/**
 * 새 버프 추가 시 기존 버프 목록에서 교체 대상 찾기.
 * 명세 §5.2 dupType 규칙 구현.
 * buffs.json에 dupType 필드가 없으므로 기본 동작(dupType=0) 적용:
 *   같은 creator + 같은 buffCode → 교체.
 * overLap > 0이면 중첩 허용 (overLap 횟수까지 스택).
 *
 * @returns 제거할 기존 버프 (없으면 null)
 */
export function findDuplicateBuff(
  existing: BuffInstance[],
  newBuff: BuffInstance
): BuffInstance | null {
  // overLap > 0: 같은 buffCode의 기존 스택 수 확인
  const overLap = newBuff.data.overLap ?? 0
  if (overLap > 0) {
    const sameCodeCount = existing.filter(b => b.buffCode === newBuff.buffCode).length
    if (sameCodeCount < overLap) return null  // 스택 여유 → 교체 없이 추가
    // 스택 초과 → 가장 오래된 동일 코드 버프 교체
    for (const b of existing) {
      if (b.buffCode === newBuff.buffCode) return b
    }
  }

  // dupType=0: creator + buffCode 모두 일치해야 교체
  for (const b of existing) {
    if (b.creatorKey === newBuff.creatorKey && b.buffCode === newBuff.buffCode) return b
  }
  return null
}

// ─── groupCode 면역 ───────────────────────────────────────

/**
 * 대상이 해당 groupCode/subType 조합에 면역인지 확인.
 * 명세 §5.4 groupCode 처리.
 */
export function isGroupCodeImmune(
  existing: BuffInstance[],
  addSubType: number,
  checkSubType: number,
  groupCode: number
): boolean {
  // 특정 subType은 면역 체크 스킵
  if (addSubType === 0x21 || addSubType === 0x0F || addSubType === 0x10) return false
  if (groupCode === 0) return false

  for (const b of existing) {
    if (b.data.subType === checkSubType) {
      if (b.data.groupCode === groupCode) return true
      if (b.data.groupCode === 1000) return true  // 와일드카드
    }
  }
  return false
}

// ─── 침묵 체크 ────────────────────────────────────────────

/** 대상이 침묵 상태인지 (subType 0x0E 버프 보유) */
export function hasSilence(buffs: BuffInstance[]): boolean {
  return buffs.some(b => b.data.subType === 0x0E)
}

/** 도발 보유 여부 (subType 0x09) */
export function hasTaunt(buffs: BuffInstance[]): boolean {
  return buffs.some(b => b.data.subType === 0x09)
}

/** 혼란 보유 여부 (subType 0x0A) */
export function hasChaos(buffs: BuffInstance[]): boolean {
  return buffs.some(b => b.data.subType === 0x0A)
}

/** 혼란 유도 보유 여부 (subType 0x1D) */
export function hasInducingChaos(buffs: BuffInstance[]): boolean {
  return buffs.some(b => b.data.subType === 0x1D)
}

/** 스텔스 보유 여부 (subType 0x14 = 타겟 불가) */
export function hasStealth(buffs: BuffInstance[]): boolean {
  return buffs.some(b => b.data.subType === 0x14)
}

// ─── 스침 시 디버프 턴 초기화 (SetConstructorTurnCount) ──

/**
 * 생성 시점 스침 판정 적용.
 * 명세 §3.4: 디버프에만 적용, 버프(type=1)는 영향 없음.
 */
export function applyGrazeToNewBuff(buff: BuffInstance): void {
  if (!buff.isDodgeHit) {
    buff.currentTurn = 0
    return
  }
  if (buff.data.categoryRaw === 1) {
    // 버프(categoryRaw=1)는 스침 영향 없음
    buff.currentTurn = 0
    return
  }
  // 디버프 + 스침: 턴 50% 감소
  const maxTurn = getMaxTurn(buff)
  const reduced = maxTurn - Math.floor(0.5 * maxTurn)
  buff.currentTurn = Math.min(reduced, maxTurn - 1)
}

// ─── magicValue 계산 (27 모드) ────────────────────────────

/** 캐릭터 스탯 접근용 인터페이스 (GetMagicValue에서 사용) */
export interface MagicValueSource {
  atk: number
  hp: number
  maxHp: number
  supportPower: number
  def: number          // [0, 1] 소수
  critRate: number     // [0, 1] 소수
  agility: number      // [0, 1] 소수
  baseHp: number       // 기본 레벨1 HP
  dodgeReduceRate: number
  counterRate: number
}

/**
 * GetMagicValue — 27가지 모드 전체 구현.
 * 명세: Docs/명세/전투/08-버프.md §4.3
 *
 * @param mode   buffBasic.valueBaseType (0~26)
 * @param mv     buffBasic.magicValue1 또는 magicValue2
 * @param source owner 또는 creator의 스탯
 * @param creator creator 스탯 (mode 5,6,7,8,13,16,19,20,22,25에 필요)
 * @param dv     buff.damageValue (mode 13에 필요)
 */
export function getMagicValue(
  mode: number,
  mv: number,
  source: MagicValueSource,
  creator: MagicValueSource,
  dv = 0,
  rateMaxLimit = 9999.0
): number {
  switch (mode) {
    case 0:  return mv
    case 1:  return source.atk * mv
    case 2:  return source.atk * mv
    case 3: {
      const rate = Math.min(source.hp / source.maxHp, rateMaxLimit)
      return rate * mv
    }
    case 4: {
      const rate = Math.min(source.maxHp, rateMaxLimit)
      return rate * mv
    }
    case 5: {
      const ratio = 1.0 - source.hp / source.maxHp
      return ratio * mv * creator.atk
    }
    case 6:  return source.agility * creator.atk * mv
    case 7:  return source.def * creator.atk * mv
    case 8: {
      const ratio = source.hp / source.maxHp
      return ratio * mv * creator.atk
    }
    case 9:  return source.supportPower * mv
    case 10: return (source.hp / source.maxHp) * mv
    case 11: return (1.0 - source.hp / source.maxHp) * mv
    case 12: return source.agility * mv
    case 13: return dv * mv
    case 14: return source.def * mv
    case 15: return source.critRate * mv
    case 16: {
      const maxHpCapped = Math.min(source.maxHp, rateMaxLimit)
      return maxHpCapped * source.atk * mv
    }
    case 17: return (source.maxHp - source.baseHp) * mv
    case 18: return (source.maxHp / source.baseHp - 1.0) * mv
    case 19: return source.supportPower * creator.atk * mv
    case 20: return source.critRate * creator.atk * mv
    case 21: return Math.max(0, (1.0 - source.agility) * mv)
    case 22: {
      const curHpCapped = Math.min(source.hp, rateMaxLimit)
      return curHpCapped * creator.atk * mv
    }
    case 23: {
      const maxHpCapped = Math.min(source.maxHp, rateMaxLimit)
      return source.agility * maxHpCapped * mv
    }
    case 24: return Math.max(0, (1.0 - source.dodgeReduceRate) * mv)
    case 25: return source.atk * source.dodgeReduceRate * mv
    case 26: return source.counterRate * mv
    default: return mv
  }
}

// ─── 버프 적용 헬퍼 ─────────────────────────────────────────

/**
 * 대상 캐릭터에 버프를 적용하는 통합 함수.
 * 명세 §2.3 ProcessBuffList + CreateBuffProcess 흐름.
 *
 * @returns 적용된 BuffInstance (면역/중복 등으로 미적용 시 null)
 */
export function applyBuffToChar(
  target: BattleCharacter,
  data: BuffData,
  creatorKey: string,
  options: {
    damageValue?: number
    isDodgeHit?: boolean
    isCritical?: boolean
    overrideTurn?: number
    creatorSource?: MagicValueSource
    ownerSource?: MagicValueSource
  } = {}
): BuffInstance | null {
  if (target.hp <= 0) return null

  // groupCode 면역 체크
  if (isGroupCodeImmune(target.activeBuffs, data.subType, data.subType, data.groupCode)) {
    return null
  }

  // 버프 인스턴스 생성
  const instance = createBuffInstance(data, target.key, creatorKey, {
    damageValue: options.damageValue,
    isDodgeHit: options.isDodgeHit,
    isCritical: options.isCritical,
    overrideTurn: options.overrideTurn,
  })

  // graze 적용
  applyGrazeToNewBuff(instance)

  // computedValue 계산
  const ownerSrc = options.ownerSource ?? charToMagicSource(target)
  const creatorSrc = options.creatorSource ?? ownerSrc
  instance.computedValue = getMagicValue(
    data.valueBaseType,
    data.magicValue1,
    ownerSrc,
    creatorSrc,
    options.damageValue ?? 0
  )

  // 중복 교체
  const dup = findDuplicateBuff(target.activeBuffs, instance)
  if (dup) {
    target.activeBuffs = target.activeBuffs.filter(b => b !== dup)
  }

  target.activeBuffs.push(instance)

  // EnergyGuard: computedValue를 tempHp에 추가
  if (data.classType === 'EnergyGuard') {
    target.tempHp += instance.computedValue
  }

  return instance
}

// ─── 버프 목록에서 특정 subType 스탯 합산 ─────────────────

/** 특정 subType의 활성 버프 합산값 */
export function sumBuffSubType(buffs: BuffInstance[], subType: number): number {
  return buffs
    .filter(b => b.data.subType === subType)
    .reduce((acc, b) => acc + b.computedValue, 0)
}

/** BattleCharacter 기준 MagicValueSource 생성 */
export function charToMagicSource(char: BattleCharacter): MagicValueSource {
  return {
    atk: char.atk,
    hp: char.hp,
    maxHp: char.maxHp,
    supportPower: char.supportPower,
    def: char.def / 100,
    critRate: char.critRate / 100,
    agility: char.agility / 100,
    baseHp: char.baseHp,
    dodgeReduceRate: char.agility / 100 * 0.35,  // 회피 감쇠율 = 민첩성 비례
    counterRate: char.patience / 100,             // 반격율 = 인내
  }
}
