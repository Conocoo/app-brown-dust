// 턴 실행 로직
// 명세: Docs/명세/전투/04-전투-흐름.md §4~7

import type { BattleCharacter, BattleLogEntry } from '../types/battle'
import { calcDamage } from './damage'
import { processDieCheck, processOtherDiedAdd } from './death'
import { updateBuff, hasSilence, hasTaunt, hasChaos, isEndBuff, applyBuffToChar, charToMagicSource } from './buff'
import {
  isTurnSkillUse, plusCoolTimeCount, onSkillUsed, getRepeatCount,
} from './skill'
import { getSkillByCode } from '../data/skills'
import { getBuffByCode } from '../data/buffs'
import {
  getEnemyList, searchEnemyTarget, searchMultiTarget, COL_COUNT, GRID_SIZE,
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
    hasIgnoreAggro: char.activeBuffs.some(b => b.data.subType === 0x18),
    hasMultiTargetException: char.activeBuffs.some(b =>
      b.data.subType === 0x3D || b.data.subType === 0x13 || b.data.subType === 0x1A
    ),
    searchTypeOverride: null,
  }
}

/** 팀 배열 → 9칸 sparse 그리드 (빈 칸은 dead placeholder) */
function buildGrid(chars: BattleCharacter[]): GridChar[] {
  const grid: GridChar[] = Array.from({ length: GRID_SIZE }, (_, i) => ({
    gridIndex: i,
    key: '',
    isDead: true,
    hasTaunt: false,
    hasFocusFire: false,
    hasAggro: false,
    hasChaos: false,
    hasChaosBuff: false,
    hasTargetExcept: false,
    hasIgnoreAggro: false,
    hasMultiTargetException: false,
    searchTypeOverride: null,
  }))
  for (const c of chars) {
    if (c.hp > 0) {
      const gc = charToGridChar(c)
      grid[gc.gridIndex] = gc
    }
  }
  return grid
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

  // 0. DoT / DotHeal 처리 (기절 중에도 적용)
  for (const buff of [...attacker.activeBuffs]) {
    if (attacker.hp <= 0) break

    if (buff.data.classType === 'DotDamage') {
      const dmg = Math.floor(buff.computedValue)
      if (dmg <= 0) continue
      attacker.hp = Math.max(0, attacker.hp - dmg)
      log.push({
        type: 'dot_damage',
        charKey: attacker.key,
        damage: dmg,
        buffCode: buff.buffCode,
        detail: `${attacker.name} DoT 데미지: ${dmg} (버프 ${buff.buffCode})`,
      })
      if (attacker.hp <= 0) {
        const dotDeathResult = processDieCheck(attacker, true, log)
        if (!dotDeathResult.survived) {
          processOtherDiedAdd(attacker, ownerList, log)
        }
        break
      }
    } else if (buff.data.classType === 'DotHeal') {
      const heal = Math.floor(buff.computedValue)
      if (heal <= 0) continue
      const before = attacker.hp
      attacker.hp = Math.min(attacker.maxHp, attacker.hp + heal)
      const actualHeal = attacker.hp - before
      if (actualHeal > 0) {
        log.push({
          type: 'dot_heal',
          charKey: attacker.key,
          restoreHp: actualHeal,
          buffCode: buff.buffCode,
          detail: `${attacker.name} DoT 회복: ${actualHeal} (버프 ${buff.buffCode})`,
        })
      }
    }
  }

  // 사망했으면 턴 종료
  if (attacker.hp <= 0) return

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

  // 2.5 before_attack 버프 적용 (useType=2, 자신에게)
  const skillTemplate = getSkillByCode(skillCode)
  if (skillTemplate) {
    for (const buffRef of skillTemplate.buffs) {
      const buffData = getBuffByCode(buffRef.buffCode)
      if (!buffData || buffData.useType !== 2) continue
      const instance = applyBuffToChar(attacker, buffData, attacker.key)
      if (instance) {
        log.push({
          type: 'buff_applied',
          charKey: attacker.key,
          buffCode: buffData.code,
          detail: `${attacker.name} 공격 전 버프: ${buffData.nameKr} (code ${buffData.code})`,
        })
      }
    }
  }

  // 3. 타겟 선택
  const attackerGridChar = charToGridChar(attacker)

  // 혼란 시 적/아군 스왑 (9칸 sparse 그리드)
  const targetList = getEnemyList(
    attackerGridChar,
    buildGrid(ownerList),
    buildGrid(enemyList)
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

      let finalDamage = result.totalDamage

      // ── 데미지 적용 파이프라인: DamageSharing → EachDamageLimit → CountGuard → EnergyGuard → DelayDamage/HP → Thorns/FlameGuard ──

      // 0. DamageSharing / AllyDamageSharing: 데미지 분담
      let sharingTarget: BattleCharacter | null = null
      let sharingDamage = 0
      const sharingBuff = target.activeBuffs.find(
        b => (b.data.classType === 'DamageSharing' || b.data.classType === 'AllyDamageSharing') && b.computedValue > 0
      )
      if (sharingBuff) {
        const ratio = sharingBuff.computedValue
        // 분담 대상 = 버프의 creator
        const candidate = [...ownerList, ...enemyList].find(c => c.key === sharingBuff.creatorKey && c.hp > 0 && c.key !== target.key)
        if (candidate) {
          sharingTarget = candidate
          sharingDamage = Math.floor(finalDamage * ratio)
          finalDamage = finalDamage - sharingDamage
        }
      }

      // 1. EachDamageLimit: 1회 피해 상한 클램프
      const eachDamageLimitBuff = target.activeBuffs.find(
        b => b.data.classType === 'EachDamageLimit'
      )
      if (eachDamageLimitBuff && eachDamageLimitBuff.computedValue > 0) {
        finalDamage = Math.min(finalDamage, eachDamageLimitBuff.computedValue)
      }

      // 2. CountGuard: 가변 데미지 무효화 (카운트 차감)
      const countGuardBuff = target.activeBuffs.find(
        b => b.data.classType === 'CountGuard' && b.computedValue > 0
      )
      if (countGuardBuff) {
        finalDamage = 0
        countGuardBuff.computedValue -= 1
        if (countGuardBuff.computedValue <= 0) {
          target.activeBuffs = target.activeBuffs.filter(b => b !== countGuardBuff)
          log.push({
            type: 'buff_expired',
            charKey: target.key,
            detail: `${target.name} 카운트가드 소멸 (횟수 소진)`,
          })
        }
      }

      // 3. EnergyGuard: tempHp(쉴드) 먼저 소모
      if (target.tempHp > 0 && finalDamage > 0) {
        if (finalDamage <= target.tempHp) {
          target.tempHp -= finalDamage
          finalDamage = 0
        } else {
          finalDamage -= target.tempHp
          target.tempHp = 0
        }
      }

      // 4. DelayDamage: 데미지 축적 (즉시 HP 감소 대신 버프에 누적)
      const delayDamageBuff = target.activeBuffs.find(
        b => b.data.classType === 'DelayDamage'
      )
      if (delayDamageBuff && finalDamage > 0) {
        delayDamageBuff.damageValue += finalDamage
        log.push({
          type: 'skill_effect',
          charKey: target.key,
          detail: `${target.name} 지연 데미지 축적: ${finalDamage} (누적: ${delayDamageBuff.damageValue})`,
        })
        finalDamage = 0
      }

      // 5. HP 감소
      target.hp = Math.max(0, target.hp - finalDamage)

      // 5.5. DamageSharing 분담 대상에게 데미지 적용
      if (sharingTarget && sharingDamage > 0) {
        sharingTarget.hp = Math.max(0, sharingTarget.hp - sharingDamage)
        log.push({
          type: 'attack',
          charKey: target.key,
          targetKey: sharingTarget.key,
          damage: sharingDamage,
          detail: `${target.name} → ${sharingTarget.name}: 데미지 분담 ${sharingDamage}`,
        })
        if (sharingTarget.hp <= 0) {
          const sharingDeathResult = processDieCheck(sharingTarget, false, log)
          if (!sharingDeathResult.survived) {
            const sharingDeadTeam = sharingTarget.team === 'A' ? opts.teamA : opts.teamB
            processOtherDiedAdd(sharingTarget, sharingDeadTeam, log)
          }
        }
      }

      log.push({
        type: 'attack',
        charKey: attacker.key,
        targetKey: target.key,
        damage: result.totalDamage,
        isCritical: result.isCritical,
        isDodge: result.isDodge,
        detail: `${attacker.name} → ${target.name}: ${result.totalDamage} 데미지${result.isCritical ? ' (치명타)' : ''}${result.isDodge ? ' (스침)' : ''}`,
      })

      // 6. Thorns / FlameGuard: 반사 데미지
      if (result.totalDamage > 0 && attacker.hp > 0) {
        const thornsBuffs = target.activeBuffs.filter(
          b => b.data.classType === 'Thorns' || b.data.classType === 'FlameGuard'
        )
        for (const thornBuff of thornsBuffs) {
          if (attacker.hp <= 0) break
          const reflectDmg = Math.floor(thornBuff.computedValue)
          if (reflectDmg <= 0) continue
          attacker.hp = Math.max(0, attacker.hp - reflectDmg)
          log.push({
            type: 'attack',
            charKey: target.key,
            targetKey: attacker.key,
            damage: reflectDmg,
            detail: `${target.name} → ${attacker.name}: ${thornBuff.data.nameKr} 반사 데미지 ${reflectDmg}`,
          })
          if (attacker.hp <= 0) {
            const reflectDeathResult = processDieCheck(attacker, false, log, target)
            if (!reflectDeathResult.survived) {
              processOtherDiedAdd(attacker, ownerList, log)
            }
            break
          }
        }
      }

      // 7. 사망 체인 (타겟)
      if (target.hp <= 0) {
        const deathResult = processDieCheck(target, false, log, attacker)
        if (!deathResult.survived) {
          // OtherDiedAdd: 사망한 캐릭터의 아군 중 OtherDiedAdd 버프 보유자 발동
          const deadCharTeam = target.team === 'A' ? opts.teamA : opts.teamB
          processOtherDiedAdd(target, deadCharTeam, log)
        }
      }

      // 반사로 공격자 사망 시 이후 공격 중단
      if (attacker.hp <= 0) return
    }
  }

  // 5.5 after_attack 버프 적용 (useType=0, 타겟에게)
  if (skillTemplate) {
    const attackerSource = charToMagicSource(attacker)
    for (const buffRef of skillTemplate.buffs) {
      const buffData = getBuffByCode(buffRef.buffCode)
      if (!buffData || buffData.useType !== 0) continue

      // targetType: 1=아군, 2=적 → 적용 대상 결정
      const buffTargets = buffData.targetType === 1 ? [attacker] : allTargets
      for (const target of buffTargets) {
        if (target.hp <= 0) continue
        const instance = applyBuffToChar(target, buffData, attacker.key, {
          creatorSource: attackerSource,
        })
        if (instance) {
          log.push({
            type: 'buff_applied',
            charKey: attacker.key,
            targetKey: target.key,
            buffCode: buffData.code,
            detail: `${attacker.name} → ${target.name} 공격 후 버프: ${buffData.nameKr} (code ${buffData.code})`,
          })
        }
      }
    }
  }

  // 6. 버프 갱신 (turnType=0 즉시 갱신 + turnType=3 지연 갱신)
  for (const char of [...ownerList, ...enemyList]) {
    if (char.hp <= 0) continue
    const expired = char.activeBuffs.filter(b => {
      updateBuff(b, 0)
      updateBuff(b, 3)
      return isEndBuff(b)
    })
    if (expired.length > 0) {
      // DelayDamage 만료 시 누적 데미지 적용
      for (const b of expired) {
        if (b.data.classType === 'DelayDamage' && b.damageValue > 0) {
          char.hp = Math.max(0, char.hp - b.damageValue)
          log.push({
            type: 'attack',
            charKey: char.key,
            damage: b.damageValue,
            detail: `${char.name} 지연 데미지 발동: ${b.damageValue}`,
          })
          if (char.hp <= 0) {
            const delayDeathResult = processDieCheck(char, true, log)
            if (!delayDeathResult.survived) {
              const delayDeadTeam = char.team === 'A' ? opts.teamA : opts.teamB
              processOtherDiedAdd(char, delayDeadTeam, log)
            }
          }
        }
      }
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
