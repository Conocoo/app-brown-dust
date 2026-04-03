// 턴 실행 로직
// 명세: Docs/명세/전투/04-전투-흐름.md §4~7

import type { BattleCharacter, BattleLogEntry } from '../types/battle'
import { calcDamage } from './damage'
import { processDieCheck } from './death'
import { updateBuff, hasSilence, hasTaunt, hasChaos, isEndBuff } from './buff'
import {
  isTurnSkillUse, plusCoolTimeCount, onSkillUsed, getRepeatCount,
} from './skill'
import {
  getEnemyList, searchEnemyTarget, searchMultiTarget, COL_COUNT,
} from './targeting'
import type { GridChar } from './targeting'
import { WELL512 } from './random'

// ─── 턴 패스 판정 ─────────────────────────────────────────

/**
 * IsTurnPass: 기절/스킬없음/지원형+침묵 → 턴 스킵.
 * 명세 §5.1
 */
export function isTurnPass(char: BattleCharacter): boolean {
  const isStunned = char.activeBuffs.some(b => b.data.subType === 0x08)
  if (isStunned) return true
  if (char.skills.length === 0) return true
  const isSupportSilenced =
    char.type === 'support' && hasSilence(char.activeBuffs)
  if (isSupportSilenced) return true
  return false
}

// ─── BattleCharacter → GridChar 변환 ─────────────────────

export function charToGridChar(char: BattleCharacter): GridChar {
  return {
    gridIndex: char.row * COL_COUNT + char.col,
    key: char.key,
    isDead: char.hp <= 0,
    hasTaunt: hasTaunt(char.activeBuffs),
    hasFocusFire: char.activeBuffs.some(b => b.data.subType === 0x09 && b.data.targetType === 2),
    hasAggro: char.activeBuffs.some(b => b.data.subType === 0x11),
    hasChaos: hasChaos(char.activeBuffs),
    hasChaosBuff: false,
    hasTargetExcept: char.activeBuffs.some(b => b.data.subType === 0x3A),
    searchTypeOverride: null,
  }
}

// ─── 단일 캐릭터 턴 실행 ─────────────────────────────────

export interface TurnOptions {
  rng: WELL512
  teamA: BattleCharacter[]
  teamB: BattleCharacter[]
  log: BattleLogEntry[]
}

/**
 * 단일 캐릭터 턴 실행.
 * 1. 턴 패스 체크
 * 2. 쿨타임 체크 (패스이면 카운터만 증가)
 * 3. 스킬 발동: 타겟 선택 → repeatCount만큼 데미지/버프
 * 4. 사망 체인 처리
 */
export function executeTurn(
  attacker: BattleCharacter,
  opts: TurnOptions
): void {
  const { rng, log } = opts

  // 공격자의 팀 결정
  const isTeamA = attacker.team === 'A'
  const ownerList = isTeamA ? opts.teamA : opts.teamB
  const enemyList = isTeamA ? opts.teamB : opts.teamA

  log.push({
    type: 'turn_start',
    charKey: attacker.key,
    detail: `${attacker.name} 턴 시작`,
  })

  // 1. 턴 패스 체크
  if (isTurnPass(attacker)) {
    log.push({
      type: 'turn_start',
      charKey: attacker.key,
      detail: `${attacker.name} 턴 패스 (기절/침묵/스킬없음)`,
    })
    return
  }

  // 스킬 없으면 종료
  if (attacker.skills.length === 0) return
  const skill = attacker.skills[0]  // 첫 번째 스킬 사용 (간소화)

  const coolTimeCount = skill.coolTimeCount ?? 0
  const skillCode = skill.skillCode

  // 2. 쿨타임 체크
  if (!isTurnSkillUse(attacker, skillCode, coolTimeCount)) {
    plusCoolTimeCount(attacker, skillCode)
    log.push({
      type: 'casting',
      charKey: attacker.key,
      detail: `${attacker.name} 캐스팅 중 (${attacker.coolTimeCounters[skillCode] ?? 0}/${coolTimeCount})`,
    })
    return
  }

  // 스킬 발동 → 쿨타임 리셋
  onSkillUsed(attacker, skillCode)

  // 3. 타겟 선택
  const attackerGridChar = charToGridChar(attacker)

  // 혼란 시 적/아군 스왑
  const targetList = getEnemyList(
    attackerGridChar,
    ownerList.map(charToGridChar),
    enemyList.map(charToGridChar)
  )

  const searchType = skill.searchType ?? 1
  const mainTargetIdx = searchEnemyTarget(attackerGridChar, targetList, searchType, rng)

  if (mainTargetIdx === -1) {
    log.push({
      type: 'skill_effect',
      charKey: attacker.key,
      detail: `${attacker.name} 타겟 없음`,
    })
    return
  }

  // 다중 타겟 범위 확장
  const rangeType = skill.rangeType ?? 1
  const rangeSize = skill.rangeSize ?? 0
  const multiIdxs = searchMultiTarget(mainTargetIdx, targetList, rangeType, rangeSize)

  const allTargetKeys = new Set(multiIdxs.map(i => targetList[i]?.key).filter(Boolean))
  const allTargets = [...ownerList, ...enemyList].filter(c => allTargetKeys.has(c.key))

  // 4. repeatCount만큼 반복 공격
  const repeatCount = getRepeatCount(skill.repeatCount ?? 1)
  for (let r = 0; r < repeatCount; r++) {
    for (const target of allTargets) {
      if (target.hp <= 0) continue  // 이미 사망

      const result = calcDamage(
        {
          atk: attacker.atk,
          critRate: attacker.critRate,
          critDamage: attacker.critDamage,
          piercing: attacker.piercing,
          fixedDamageRate: 0,
        },
        {
          def: target.def,
          hp: target.hp,
          agility: target.agility,
          critResist: 0,
        },
        { rng }
      )

      target.hp = Math.max(0, target.hp - result.totalDamage)

      log.push({
        type: 'attack',
        charKey: attacker.key,
        targetKey: target.key,
        damage: result.totalDamage,
        isCritical: result.isCritical,
        isDodge: result.isDodge,
        detail: `${attacker.name} → ${target.name}: ${result.totalDamage} 데미지${result.isCritical ? ' (치명타)' : ''}${result.isDodge ? ' (스침)' : ''}`,
      })

      // 5. 사망 체인
      if (target.hp <= 0) {
        processDieCheck(target, false, log)
      }
    }
  }

  // 6. 버프 갱신 (turnType=0 즉시 갱신)
  for (const char of [...ownerList, ...enemyList]) {
    if (char.hp <= 0) continue
    const expired = char.activeBuffs.filter(b => {
      updateBuff(b, 0)
      return isEndBuff(b)
    })
    if (expired.length > 0) {
      char.activeBuffs = char.activeBuffs.filter(b => !expired.includes(b))
      for (const b of expired) {
        log.push({
          type: 'buff_expired',
          charKey: char.key,
          detail: `${char.name} 버프 종료: ${b.buffCode}`,
        })
      }
    }
  }
}
