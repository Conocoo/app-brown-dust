// 전투 메인 루프
// 명세: Docs/명세/전투/04-전투-흐름.md

import type { BattleCharacter, BattleLogEntry } from '../types/battle'
import { executeTurn } from './turn'
import { WELL512 } from './random'
import { calcStatsAtLevel } from './stat'
import { applyRunes } from './rune'
import { applyBuffToChar } from './buff'
import { getMercenaryById } from '../data/mercenaries'
import { getSkillByCode } from '../data/skills'
import { getBuffByCode } from '../data/buffs'
import type { RuneSlots } from '../types/rune'

// ─── 상수 ──────────────────────────────────────────────────

const MAX_ROUNDS = 300
const GAME_OVER_BUFF_ROUND = 7

// ─── 전투 결과 ─────────────────────────────────────────────

export type BattleWinner = 'A' | 'B' | 'draw'

export interface BattleResult {
  winner: BattleWinner
  rounds: number
  log: BattleLogEntry[]
  teamA: BattleCharacter[]
  teamB: BattleCharacter[]
}

// ─── BattleCharacter 생성 ─────────────────────────────────

let _charCounter = 0

export function createBattleChar(
  mercId: string,
  team: 'A' | 'B',
  level = 115,
  runes: RuneSlots = [null, null, null],
  row = 0,
  col = 0
): BattleCharacter | null {
  const merc = getMercenaryById(mercId)
  if (!merc) return null

  const base = calcStatsAtLevel(merc, level)
  const stats = applyRunes(base, runes)
  const skillTemplate = getSkillByCode(merc.skillCode)
  const key = `${team}_${mercId}_${++_charCounter}`

  const battleSkill = skillTemplate
    ? [{
        skillCode: skillTemplate.code,
        coolTimeCount: skillTemplate.coolTimeCount,
        repeatCount: Math.max(1, skillTemplate.repeatCount),
        searchType: skillTemplate.searchTypeRaw,
        rangeType: skillTemplate.rangePatternRaw,
        rangeSize: skillTemplate.rangeSize,
      }]
    : []

  return {
    key,
    id: mercId,
    name: merc.name,
    type: merc.type,
    team,
    row,
    col,
    hp: stats.hp,
    maxHp: stats.hp,
    atk: stats.atk,
    supportPower: stats.supportPower,
    def: stats.def,
    critRate: stats.critRate,
    critDamage: stats.critDamage,
    agility: stats.agility,
    piercing: stats.piercing,
    patience: stats.patience,
    activeBuffs: [],
    order: 0,
    isCasting: false,
    skills: battleSkill,
    coolTimeCounters: {},
    baseHp: merc.baseLv1?.hp ?? stats.hp,
    tempHp: 0,
    imageId: merc.imageId,
    emoji: merc.emoji,
    runes,
  }
}

// ─── 생존자 체크 ──────────────────────────────────────────

function hasLivingFighter(team: BattleCharacter[]): boolean {
  return team.some(c => c.hp > 0 && c.type !== 'support')
}

// ─── 승패 판정 ────────────────────────────────────────────

function checkWinner(teamA: BattleCharacter[], teamB: BattleCharacter[]): BattleWinner | null {
  const aAlive = hasLivingFighter(teamA)
  const bAlive = hasLivingFighter(teamB)

  if (!aAlive && !bAlive) return 'draw'
  if (!aAlive) return 'B'
  if (!bAlive) return 'A'
  return null
}

// ─── CreateWorldSequence — 인터리빙 순서 생성 ────────────

function createWorldSequence(
  teamA: BattleCharacter[],
  teamB: BattleCharacter[]
): BattleCharacter[] {
  const sequence: BattleCharacter[] = []
  let ai = 0, bi = 0
  let isATurn = true

  while (ai < teamA.length || bi < teamB.length) {
    if (isATurn) {
      while (ai < teamA.length) {
        const c = teamA[ai++]
        if (c.hp > 0) { sequence.push(c); break }
      }
    } else {
      while (bi < teamB.length) {
        const c = teamB[bi++]
        if (c.hp > 0) { sequence.push(c); break }
      }
    }

    if (ai >= teamA.length) isATurn = false
    else if (bi >= teamB.length) isATurn = true
    else isATurn = !isATurn
  }

  return sequence
}

// ─── 스킬 버프 적용 헬퍼 ──────────────────────────────────

/** 캐릭터의 스킬에서 특정 useType 버프를 자신에게 적용 */
function applySkillBuffsByUseType(
  char: BattleCharacter,
  useType: number,
  log: BattleLogEntry[]
): void {
  for (const skill of char.skills) {
    const skillTemplate = getSkillByCode(skill.skillCode)
    if (!skillTemplate) continue

    for (const buffRef of skillTemplate.buffs) {
      const buffData = getBuffByCode(buffRef.buffCode)
      if (!buffData) continue
      if (buffData.useType !== useType) continue

      const instance = applyBuffToChar(char, buffData, char.key)
      if (instance) {
        log.push({
          type: 'buff_applied',
          charKey: char.key,
          buffCode: buffData.code,
          detail: `${char.name} 버프 적용: ${buffData.nameKr} (code ${buffData.code})`,
        })
      }
    }
  }
}

// ─── 게임오버 버프 적용 ───────────────────────────────────

const GAME_OVER_BUFF_CODES = [24, 25, 26, 27, 28]

/** 라운드 7부터 매 라운드 누적 — 라운드별 고유 creator로 스택 */
function applyGameOverBuffs(
  allChars: BattleCharacter[],
  round: number,
  log: BattleLogEntry[]
): void {
  const creatorKey = `gameOver_r${round}`
  for (const c of allChars) {
    if (c.hp <= 0) continue
    for (const code of GAME_OVER_BUFF_CODES) {
      const buffData = getBuffByCode(code)
      if (!buffData) continue
      applyBuffToChar(c, buffData, creatorKey)
    }
    log.push({
      type: 'buff_applied',
      charKey: c.key,
      detail: `${c.name} 게임오버 디버프 적용 (라운드 ${round})`,
    })
  }
}

// ─── 메인 전투 시뮬레이션 ────────────────────────────────

/**
 * simulateBattle: 전체 전투를 순수 함수로 실행 → BattleResult 반환.
 * 명세 §1~3
 */
export function simulateBattle(
  teamA: BattleCharacter[],
  teamB: BattleCharacter[],
  seed = Date.now()
): BattleResult {
  const rng = new WELL512(seed)
  const log: BattleLogEntry[] = []
  let rounds = 0

  // 전투 시작 로그
  log.push({
    type: 'round_start',
    charKey: '',
    detail: `전투 시작 — A팀 ${teamA.length}명 vs B팀 ${teamB.length}명`,
  })

  // §1.4 패시브 버프 적용 (전투 시작 시 1회, useType=1)
  for (const char of [...teamA, ...teamB]) {
    applySkillBuffsByUseType(char, 1, log)
  }

  while (rounds < MAX_ROUNDS) {
    rounds++

    log.push({
      type: 'round_start',
      charKey: '',
      detail: `=== 라운드 ${rounds} 시작 ===`,
    })

    // §1.4 게임오버 버프 — 라운드 7부터 매 라운드 누적
    if (rounds >= GAME_OVER_BUFF_ROUND) {
      applyGameOverBuffs([...teamA, ...teamB], rounds, log)
    }

    // turn_start 스킬 적용 (useType=4, 매 라운드)
    for (const char of [...teamA, ...teamB]) {
      if (char.hp > 0) {
        applySkillBuffsByUseType(char, 4, log)
      }
    }

    // 라운드별 인터리빙 순서 생성 (생존자만)
    const sequence = createWorldSequence(
      teamA.filter(c => c.hp > 0),
      teamB.filter(c => c.hp > 0)
    )

    if (sequence.length === 0) break

    // 각 캐릭터 턴 실행
    for (const char of sequence) {
      if (char.hp <= 0) continue  // 이전 턴에 사망했을 수 있음

      executeTurn(char, { rng, teamA, teamB, log })

      // 중간 승패 체크
      const midWinner = checkWinner(teamA, teamB)
      if (midWinner !== null) {
        log.push({
          type: 'battle_end',
          charKey: '',
          detail: `전투 종료 (라운드 ${rounds}) — ${midWinner === 'draw' ? '무승부' : midWinner + '팀 승리'}`,
        })
        return { winner: midWinner, rounds, log, teamA, teamB }
      }

      // §8 추가 턴 (MoreTurn) 체크
      if (char.hp > 0) {
        let extraTurns = 0
        const moreTurnInfiniteBuff = char.activeBuffs.find(
          b => b.data.subType === 0x3B && b.data.categoryRaw === 1
        )
        if (moreTurnInfiniteBuff) {
          extraTurns = 2
          char.activeBuffs = char.activeBuffs.filter(b => b !== moreTurnInfiniteBuff)
        } else {
          const moreTurnBuff = char.activeBuffs.find(
            b => b.data.subType === 0x31 && b.data.categoryRaw === 1
          )
          if (moreTurnBuff) {
            extraTurns = 1
            char.activeBuffs = char.activeBuffs.filter(b => b !== moreTurnBuff)
          }
        }

        for (let et = 0; et < extraTurns; et++) {
          if (char.hp <= 0) break

          log.push({
            type: 'turn_start',
            charKey: char.key,
            detail: `${char.name} 추가 턴 (${et + 1})`,
          })

          executeTurn(char, { rng, teamA, teamB, log })

          const extraWinner = checkWinner(teamA, teamB)
          if (extraWinner !== null) {
            log.push({
              type: 'battle_end',
              charKey: '',
              detail: `전투 종료 (라운드 ${rounds}) — ${extraWinner === 'draw' ? '무승부' : extraWinner + '팀 승리'}`,
            })
            return { winner: extraWinner, rounds, log, teamA, teamB }
          }
        }
      }
    }

    // 라운드 종료 승패 체크
    const winner = checkWinner(teamA, teamB)
    if (winner !== null) {
      log.push({
        type: 'battle_end',
        charKey: '',
        detail: `전투 종료 (라운드 ${rounds}) — ${winner === 'draw' ? '무승부' : winner + '팀 승리'}`,
      })
      return { winner, rounds, log, teamA, teamB }
    }
  }

  // 최대 라운드 초과 → 무승부
  log.push({
    type: 'battle_end',
    charKey: '',
    detail: `최대 라운드(${MAX_ROUNDS}) 초과 → 무승부`,
  })

  return {
    winner: 'draw',
    rounds,
    log,
    teamA,
    teamB,
  }
}
