import { useState, useCallback, useRef, useEffect } from 'react'
import type { BattleCharacter, GamePhase, BattleLogEntry, StatusEffect, Rune } from './types/game'
import { getAllMercenaries, getMercenaryById } from './data/mercenaries'
import { resolveSkills } from './data/skills'
import { simulateBattle } from './logic/battle'
import { applyRunes } from './logic/rune'
import Board from './components/Board'
import CharacterInfo from './components/CharacterInfo'
import CharacterList from './components/CharacterList'
import OrderSetter from './components/OrderSetter'
import BattleLog from './components/BattleLog'
import MercenaryDex from './components/MercenaryDex'
import SkillDex from './components/SkillDex'
import './App.css'

const ROWS = 3
const COLS = 12
const PLAYER_COLS = 6

function createEmptyGrid(): (BattleCharacter | null)[][] {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null))
}

/** 상대 팀을 랜덤 배치 */
function placeEnemies(grid: (BattleCharacter | null)[][]): void {
  const shuffled = [...getAllMercenaries()].sort(() => Math.random() - 0.5)
  const count = Math.min(3, shuffled.length)
  const positions: { row: number; col: number }[] = []

  for (let r = 0; r < ROWS; r++) {
    for (let c = PLAYER_COLS; c < COLS; c++) {
      positions.push({ row: r, col: c })
    }
  }
  const shuffledPositions = positions.sort(() => Math.random() - 0.5)

  for (let i = 0; i < count; i++) {
    const pos = shuffledPositions[i]
    const tmpl = shuffled[i]
    const runed = applyRunes(tmpl, tmpl.runes)
    grid[pos.row][pos.col] = {
      templateId: tmpl.id,
      name: tmpl.name,
      type: tmpl.type,
      hp: runed.maxHp,
      maxHp: runed.maxHp,
      atk: runed.atk,
      supportPower: tmpl.supportPower ?? 0,
      def: runed.def,
      emoji: tmpl.emoji,
      imageId: tmpl.imageId,
      critRate: runed.critRate,
      critDamage: runed.critDamage,
      agility: tmpl.agility,
      team: 'enemy',
      row: pos.row,
      col: pos.col,
      isCasting: false,
      order: i,
      skills: resolveSkills(tmpl.skills),
      attackTarget: tmpl.attackTarget ?? 'enemy_front',
      attackRange: tmpl.attackRange ?? 'single',
      rangeSize: tmpl.rangeSize,
      tempHp: 0,
      statusEffects: [],
      runes: tmpl.runes ?? [],
      damageReduce: tmpl.damageReduce ?? 0,
      selfDestruct: tmpl.selfDestruct,
    }
  }
}

type DragSource =
  | { type: 'character'; id: string }
  | { type: 'cell'; row: number; col: number }
  | null

type ActiveTab = 'main' | 'mercenary_dex' | 'skill_dex'

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('main')
  const [grid, setGrid] = useState<(BattleCharacter | null)[][]>(createEmptyGrid)
  const [phase, setPhase] = useState<GamePhase>('home')
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null)
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [battleLogs, setBattleLogs] = useState<BattleLogEntry[]>([])
  const [visibleLogCount, setVisibleLogCount] = useState(0)
  const [winner, setWinner] = useState<'player' | 'enemy' | 'draw' | null>(null)
  const [currentRound, setCurrentRound] = useState(0)
  const [playerOrder, setPlayerOrder] = useState<BattleCharacter[]>([])

  // 속도 제어
  const [battleSpeed, setBattleSpeed] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const [isManual, setIsManual] = useState(false)

  // 드래그
  const [dragSource, setDragSource] = useState<DragSource>(null)
  const dragSourceRef = useRef<DragSource>(null)
  const dropSucceededRef = useRef(false)

  const timerRef = useRef<number | null>(null)
  const battleTeamsRef = useRef<{ players: BattleCharacter[]; enemies: BattleCharacter[] } | null>(null)

  // 배치된 플레이어 캐릭터
  const placedPlayers = grid
    .flat()
    .filter((c): c is BattleCharacter => c !== null && c.team === 'player')

  const placedIds = placedPlayers.map((c) => c.templateId)

  // 캐릭터 선택 (목록에서)
  const handleSelectCharacter = useCallback((id: string) => {
    setSelectedCharId((prev) => (prev === id ? null : id))
  }, [])

  // 격자 좌클릭
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      // 배치 단계 외: 캐릭터 있으면 selectedCell만 변경 (정보 패널용)
      if (phase !== 'placing') {
        if (grid[row][col]) setSelectedCell({ row, col })
        return
      }
      // 적 진영 클릭 → 정보 보기만
      if (col >= PLAYER_COLS) {
        if (grid[row][col]) setSelectedCell({ row, col })
        return
      }

      const existing = grid[row][col]

      // 이미 배치된 캐릭터 좌클릭 → 선택
      if (existing && existing.team === 'player') {
        setSelectedCell({ row, col })
        return
      }

      // 빈 셀에 선택된 캐릭터 배치
      if (selectedCharId) {
        const tmpl = getMercenaryById(selectedCharId)
        if (!tmpl) return
        const runed = applyRunes(tmpl, tmpl.runes)
        setGrid((prev) => {
          const next = prev.map((r) => [...r])
          const currentPlayerCount = prev.flat().filter((c): c is BattleCharacter => c !== null && c.team === 'player').length
          next[row][col] = {
            templateId: tmpl.id,
            name: tmpl.name,
            type: tmpl.type,
            hp: runed.maxHp,
            maxHp: runed.maxHp,
            atk: runed.atk,
            supportPower: tmpl.supportPower ?? 0,
            def: runed.def,
            emoji: tmpl.emoji,
            imageId: tmpl.imageId,
            critRate: runed.critRate,
            critDamage: runed.critDamage,
            agility: tmpl.agility,
            team: 'player',
            row,
            col,
            isCasting: false,
            order: currentPlayerCount,
            skills: resolveSkills(tmpl.skills),
            attackTarget: tmpl.attackTarget ?? 'enemy_front',
            attackRange: tmpl.attackRange ?? 'single',
            rangeSize: tmpl.rangeSize,
            tempHp: 0,
            statusEffects: [],
            runes: tmpl.runes ?? [],
            damageReduce: tmpl.damageReduce ?? 0,
      selfDestruct: tmpl.selfDestruct,
          }
          return next
        })
        setSelectedCharId(null)
        setSelectedCell({ row, col })
      }
    },
    [phase, selectedCharId, grid]
  )

  // 격자 우클릭: 배치 취소
  const handleCellRightClick = useCallback(
    (row: number, col: number) => {
      if (phase !== 'placing') return
      if (col >= PLAYER_COLS) return

      const existing = grid[row][col]
      if (existing && existing.team === 'player') {
        setGrid((prev) => {
          const next = prev.map((r) => [...r])
          const removedOrder = next[row][col]?.order ?? -1
          next[row][col] = null
          // 제거된 순번 이후의 플레이어 순번을 재정렬
          if (removedOrder >= 0) {
            for (const r of next) {
              for (let i = 0; i < r.length; i++) {
                if (r[i] && r[i]!.team === 'player' && r[i]!.order > removedOrder) {
                  r[i] = { ...r[i]!, order: r[i]!.order - 1 }
                }
              }
            }
          }
          return next
        })
        if (selectedCell?.row === row && selectedCell?.col === col) {
          setSelectedCell(null)
        }
      }
    },
    [phase, grid, selectedCell]
  )

  // 드래그: 목록에서 시작
  const handleDragStartFromList = useCallback((id: string) => {
    const source: DragSource = { type: 'character', id }
    setDragSource(source)
    dragSourceRef.current = source
    dropSucceededRef.current = false
    setSelectedCharId(id)
  }, [])

  // 드래그: 셀에서 시작
  const handleDragStartFromCell = useCallback((row: number, col: number) => {
    const source: DragSource = { type: 'cell', row, col }
    setDragSource(source)
    dragSourceRef.current = source
    dropSucceededRef.current = false
  }, [])

  // 드래그: 셀 위로
  const handleDragOverCell = useCallback((e: React.DragEvent, _row: number, _col: number) => {
    if (dragSource) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
    }
  }, [dragSource])

  // 드래그: 셀에 드롭
  const handleDropOnCell = useCallback(
    (row: number, col: number) => {
      if (phase !== 'placing' || !dragSource) return
      if (col >= PLAYER_COLS) return

      setGrid((prev) => {
        const next = prev.map((r) => [...r])
        const targetCell = next[row][col]

        if (dragSource.type === 'character') {
          // 목록에서 드래그 → 빈 셀에 배치
          if (targetCell !== null) return next
          const tmpl = getMercenaryById(dragSource.id)
          if (!tmpl) return next
          const runed = applyRunes(tmpl, tmpl.runes)
          const currentPlayerCount = prev.flat().filter((c): c is BattleCharacter => c !== null && c.team === 'player').length
          next[row][col] = {
            templateId: tmpl.id,
            name: tmpl.name,
            type: tmpl.type,
            hp: runed.maxHp,
            maxHp: runed.maxHp,
            atk: runed.atk,
            supportPower: tmpl.supportPower ?? 0,
            def: runed.def,
            emoji: tmpl.emoji,
            imageId: tmpl.imageId,
            critRate: runed.critRate,
            critDamage: runed.critDamage,
            agility: tmpl.agility,
            team: 'player',
            row,
            col,
            isCasting: false,
            order: currentPlayerCount,
            skills: resolveSkills(tmpl.skills),
            attackTarget: tmpl.attackTarget ?? 'enemy_front',
            attackRange: tmpl.attackRange ?? 'single',
            rangeSize: tmpl.rangeSize,
            tempHp: 0,
            statusEffects: [],
            runes: tmpl.runes ?? [],
            damageReduce: tmpl.damageReduce ?? 0,
      selfDestruct: tmpl.selfDestruct,
          }
        } else if (dragSource.type === 'cell') {
          // 셀에서 셀로 이동
          const srcChar = next[dragSource.row][dragSource.col]
          if (!srcChar) return next
          if (targetCell !== null) return next
          next[dragSource.row][dragSource.col] = null
          next[row][col] = { ...srcChar, row, col }
        }

        return next
      })
      dropSucceededRef.current = true
      setDragSource(null)
      dragSourceRef.current = null
      setSelectedCharId(null)
      setSelectedCell({ row, col })
    },
    [phase, dragSource]
  )

  // 드래그 종료: 보드 밖에 드롭하면 용병 제거
  useEffect(() => {
    const handleDragEnd = () => {
      const source = dragSourceRef.current
      if (source && source.type === 'cell' && !dropSucceededRef.current) {
        setGrid((prev) => {
          const next = prev.map((r) => [...r])
          const removedOrder = next[source.row][source.col]?.order ?? -1
          next[source.row][source.col] = null
          // 제거된 순번 이후의 플레이어 순번을 재정렬
          if (removedOrder >= 0) {
            for (const r of next) {
              for (let i = 0; i < r.length; i++) {
                if (r[i] && r[i]!.team === 'player' && r[i]!.order > removedOrder) {
                  r[i] = { ...r[i]!, order: r[i]!.order - 1 }
                }
              }
            }
          }
          return next
        })
        setSelectedCell((prev) =>
          prev?.row === source.row && prev?.col === source.col ? null : prev
        )
      }
      setDragSource(null)
      dragSourceRef.current = null
      dropSucceededRef.current = false
    }
    document.addEventListener('dragend', handleDragEnd)
    return () => document.removeEventListener('dragend', handleDragEnd)
  }, [])

  // 배치 완료 → 순서 지정 단계로 (배치 순서 유지)
  const handleGoToOrdering = useCallback(() => {
    if (placedPlayers.length === 0) return
    const chars = placedPlayers.map((c) => ({ ...c }))
    setPlayerOrder(chars)
    setPhase('ordering')
  }, [placedPlayers])

  // 순서 업데이트
  const handleOrderUpdate = useCallback((updated: BattleCharacter[]) => {
    const allOrdered = updated.every((c) => c.order >= 0)
    setPlayerOrder(updated)

    if (allOrdered) {
      setGrid((prev) => {
        const next = prev.map((r) => [...r])
        for (const char of updated) {
          next[char.row][char.col] = { ...char }
        }
        return next
      })
    }
  }, [])

  // 로그를 그리드에 반영
  const applyLogToGrid = useCallback((logs: BattleLogEntry[], upTo: number) => {
    setGrid((prev) => {
      const next = prev.map((r) => [...r])
      for (const row of next) {
        for (let i = 0; i < row.length; i++) {
          if (row[i]) {
            row[i] = { ...row[i]!, hp: row[i]!.maxHp, isCasting: false, statusEffects: [] }
          }
        }
      }
      const state = new Map<string, { hp: number; isCasting: boolean; statusEffects: StatusEffect[] }>()
      for (const row of next) {
        for (const cell of row) {
          if (cell) {
            state.set(`${cell.team}-${cell.templateId}`, { hp: cell.maxHp, isCasting: false, statusEffects: [] })
          }
        }
      }
      for (let i = 0; i < upTo && i < logs.length; i++) {
        const log = logs[i]
        if ((log.type === 'attack' || log.type === 'reflect' || log.type === 'rebirth' || log.type === 'revival') && log.defenderHpAfter !== undefined) {
          if (log.targetKey) {
            const s = state.get(log.targetKey)
            if (s) s.hp = log.defenderHpAfter
          }
        }
        if (log.type === 'casting' && log.message) {
          state.forEach((val, key) => {
            const name = getNameFromTemplate(key.split('-').slice(1).join('-'))
            if (log.message!.includes(name)) {
              val.isCasting = true
            }
          })
        }
        if (log.targetKey && log.targetStatusEffects !== undefined) {
          const s = state.get(log.targetKey)
          if (s) s.statusEffects = [...log.targetStatusEffects]
        }
      }
      for (const row of next) {
        for (let i = 0; i < row.length; i++) {
          if (row[i]) {
            const key = `${row[i]!.team}-${row[i]!.templateId}`
            const s = state.get(key)
            if (s) {
              row[i] = { ...row[i]!, hp: s.hp, isCasting: s.isCasting, statusEffects: s.statusEffects }
            }
          }
        }
      }
      return next
    })
  }, [])

  // 전투 시작
  const handleStartBattle = useCallback(() => {
    const playerTeam = playerOrder.filter((c) => c.order >= 0)
    const enemyTeam = grid
      .flat()
      .filter((c): c is BattleCharacter => c !== null && c.team === 'enemy')

    const logs = simulateBattle(playerTeam, enemyTeam)
    battleTeamsRef.current = { players: playerTeam, enemies: enemyTeam }

    setBattleLogs(logs)
    setVisibleLogCount(0)
    setPhase('battling')
    setCurrentRound(1)
    setBattleSpeed(1)
    setIsPaused(false)
    setIsManual(false)
  }, [grid, playerOrder])

  // 전투 재생 인터벌 관리
  useEffect(() => {
    if (phase !== 'battling') return
    if (isPaused || isManual) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }

    const ms = 600 / battleSpeed
    timerRef.current = window.setInterval(() => {
      setVisibleLogCount((prev) => {
        if (prev >= battleLogs.length) {
          if (timerRef.current) clearInterval(timerRef.current)
          timerRef.current = null
          return prev
        }
        return prev + 1
      })
    }, ms) as unknown as number

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [phase, battleSpeed, isPaused, isManual, battleLogs.length])

  // 로그 카운트 변경 → 그리드 업데이트 + 완료 체크
  useEffect(() => {
    if (battleLogs.length === 0 || visibleLogCount === 0) return

    const log = battleLogs[visibleLogCount - 1]
    if (log?.type === 'round_start' && log.round) {
      setCurrentRound(log.round)
    }

    applyLogToGrid(battleLogs, visibleLogCount)

    if (visibleLogCount >= battleLogs.length && phase === 'battling') {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      const teams = battleTeamsRef.current
      if (teams) {
        const finalPlayers = teams.players.map((c) => ({ ...c }))
        const finalEnemies = teams.enemies.map((c) => ({ ...c }))
        replayHp(finalPlayers, finalEnemies, battleLogs)

        const playersAlive = finalPlayers.some((c) => c.hp > 0 && c.type !== 'support')
        const enemiesAlive = finalEnemies.some((c) => c.hp > 0 && c.type !== 'support')

        if (!enemiesAlive && playersAlive) setWinner('player')
        else if (!playersAlive && enemiesAlive) setWinner('enemy')
        else setWinner('draw')
      }

      setPhase('result')
    }
  }, [visibleLogCount, battleLogs, phase, applyLogToGrid])

  // 속도 제어 핸들러
  const handlePauseToggle = useCallback(() => {
    setIsPaused((prev) => !prev)
  }, [])

  const handleManualToggle = useCallback(() => {
    setIsManual((prev) => !prev)
    setIsPaused(false)
  }, [])

  const handleManualStep = useCallback(() => {
    if (visibleLogCount < battleLogs.length) {
      setVisibleLogCount((prev) => prev + 1)
    }
  }, [visibleLogCount, battleLogs.length])

  const handleSkipRound = useCallback(() => {
    let target = visibleLogCount
    for (let i = visibleLogCount; i < battleLogs.length; i++) {
      target = i + 1
      if (i > visibleLogCount && battleLogs[i].type === 'round_start') {
        break
      }
    }
    setVisibleLogCount(Math.min(target, battleLogs.length))
  }, [visibleLogCount, battleLogs])

  const handleSkipAll = useCallback(() => {
    setVisibleLogCount(battleLogs.length)
  }, [battleLogs.length])

  // 룬 변경 (배치 단계 전용)
  const handleRuneChange = useCallback((row: number, col: number, runes: Rune[]) => {
    setGrid((prev: (BattleCharacter | null)[][]) => {
      const next = prev.map((r: (BattleCharacter | null)[]) => [...r])
      const char = next[row][col]
      if (!char) return next
      const tmpl = getMercenaryById(char.templateId)
      if (!tmpl) return next
      const runed = applyRunes(tmpl, runes)
      next[row][col] = {
        ...char,
        hp: runed.maxHp,
        maxHp: runed.maxHp,
        atk: runed.atk,
        def: runed.def,
        critRate: runed.critRate,
        critDamage: runed.critDamage,
        runes,
      }
      return next
    })
  }, [])

  // 다시 하기
  const handleReset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    const g = createEmptyGrid()
    placeEnemies(g)
    setGrid(g)
    setPhase('home')
    setSelectedCharId(null)
    setSelectedCell(null)
    setBattleLogs([])
    setVisibleLogCount(0)
    setWinner(null)
    setCurrentRound(0)
    setPlayerOrder([])
    setBattleSpeed(1)
    setIsPaused(false)
    setIsManual(false)
    setDragSource(null)
    battleTeamsRef.current = null
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // 정보 패널에 표시할 캐릭터: 그리드 선택 > 목록 선택
  const selectedCharacter: BattleCharacter | null = (() => {
    if (selectedCell) return grid[selectedCell.row][selectedCell.col]
    if (selectedCharId) {
      const tmpl = getMercenaryById(selectedCharId)
      if (!tmpl) return null
      const runed = applyRunes(tmpl, tmpl.runes)
      return {
        templateId: tmpl.id,
        name: tmpl.name,
        type: tmpl.type,
        hp: runed.maxHp,
        maxHp: runed.maxHp,
        atk: runed.atk,
        supportPower: tmpl.supportPower ?? 0,
        def: runed.def,
        emoji: tmpl.emoji,
        imageId: tmpl.imageId,
        critRate: runed.critRate,
        critDamage: runed.critDamage,
        agility: tmpl.agility,
        team: 'player' as const,
        row: -1,
        col: -1,
        isCasting: false,
        order: -1,
        skills: resolveSkills(tmpl.skills),
        attackTarget: tmpl.attackTarget ?? 'enemy_front',
        attackRange: tmpl.attackRange ?? 'single',
        rangeSize: tmpl.rangeSize,
        tempHp: 0,
        statusEffects: [],
        runes: tmpl.runes ?? [],
        damageReduce: tmpl.damageReduce ?? 0,
      selfDestruct: tmpl.selfDestruct,
      }
    }
    return null
  })()

  const handleEnterBattle = useCallback(() => {
    const g = createEmptyGrid()
    placeEnemies(g)
    setGrid(g)
    setPhase('placing')
  }, [])

  if (activeTab === 'mercenary_dex') {
    return (
      <div className="app">
        <MercenaryDex onBack={() => setActiveTab('main')} />
      </div>
    )
  }

  if (activeTab === 'skill_dex') {
    return (
      <div className="app">
        <SkillDex onBack={() => setActiveTab('main')} />
      </div>
    )
  }

  if (phase === 'home') {
    return (
      <div className="app home">
        <h1>브라운더스트 전투 시뮬레이터</h1>
        <p className="home-desc">용병을 배치하고 전투를 시뮬레이션하세요.</p>
        <div className="home-buttons">
          <button className="btn-start" onClick={handleEnterBattle}>
            전투 시작
          </button>
          <button className="btn-home" onClick={() => setActiveTab('mercenary_dex')}>용병 도감</button>
          <button className="btn-home" onClick={() => setActiveTab('skill_dex')}>스킬 도감</button>
          <button className="btn-home" disabled>카드 도감</button>
          <button className="btn-home" disabled>규칙 설명</button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <h1>브라운더스트 전투 시뮬레이터</h1>

      <CharacterInfo
        character={selectedCharacter}
        isBattle={phase === 'battling' || phase === 'result'}
        isPlacing={phase === 'placing'}
        onRuneChange={selectedCell
          ? (runes) => handleRuneChange(selectedCell.row, selectedCell.col, runes)
          : undefined}
      />

      <Board
        grid={grid}
        onCellClick={handleCellClick}
        onCellRightClick={handleCellRightClick}
        selectedCell={selectedCell}
        disabled={phase !== 'placing'}
        currentRound={phase === 'battling' || phase === 'result' ? currentRound : undefined}
        onDragStart={phase === 'placing' ? handleDragStartFromCell : undefined}
        onDragOver={phase === 'placing' ? handleDragOverCell : undefined}
        onDrop={phase === 'placing' ? handleDropOnCell : undefined}
      />

      {phase === 'placing' && (
        <>
          <CharacterList
            characters={getAllMercenaries()}
            placedIds={placedIds}
            selectedId={selectedCharId}
            onSelect={handleSelectCharacter}
            onDragStart={handleDragStartFromList}
            disabled={false}
          />
          <button
            className="btn-start"
            onClick={handleGoToOrdering}
            disabled={placedPlayers.length === 0}
          >
            순서 지정으로 ({placedPlayers.length}명 배치됨)
          </button>
        </>
      )}

      {phase === 'ordering' && (
        <OrderSetter
          characters={playerOrder}
          onOrderSet={handleOrderUpdate}
        />
      )}

      {phase === 'ordering' && playerOrder.every((c) => c.order >= 0) && (
        <button className="btn-start" onClick={handleStartBattle}>
          전투 시작!
        </button>
      )}

      {/* 전투 속도 제어 */}
      {phase === 'battling' && (
        <div className="battle-controls">
          <div className="speed-buttons">
            <button className={battleSpeed === 1 ? 'speed-active' : ''} onClick={() => setBattleSpeed(1)}>1x</button>
            <button className={battleSpeed === 2 ? 'speed-active' : ''} onClick={() => setBattleSpeed(2)}>2x</button>
            <button className={battleSpeed === 4 ? 'speed-active' : ''} onClick={() => setBattleSpeed(4)}>4x</button>
          </div>
          <div className="playback-buttons">
            <button onClick={handlePauseToggle}>
              {isPaused ? '▶ 재개' : '⏸ 일시정지'}
            </button>
            <button className={isManual ? 'speed-active' : ''} onClick={handleManualToggle}>
              {isManual ? '🔄 자동' : '👆 수동'}
            </button>
            {isManual && (
              <button onClick={handleManualStep} disabled={visibleLogCount >= battleLogs.length}>
                다음 ▶
              </button>
            )}
            <button onClick={handleSkipRound}>라운드 건너뛰기 ⏭</button>
            <button onClick={handleSkipAll}>전체 건너뛰기 ⏩</button>
          </div>
        </div>
      )}

      {(phase === 'battling' || phase === 'result') && (
        <BattleLog logs={battleLogs} visibleCount={visibleLogCount} />
      )}

      {phase === 'result' && (
        <div className="result">
          <h2 className="result-title">
            {winner === 'player' && '승리!'}
            {winner === 'enemy' && '패배...'}
            {winner === 'draw' && '무승부'}
          </h2>
          <button className="btn-reset" onClick={handleReset}>
            다시 하기
          </button>
        </div>
      )}
    </div>
  )
}

/** templateId에서 캐릭터 이름 찾기 */
function getNameFromTemplate(templateId: string): string {
  const found = getMercenaryById(templateId)
  return found?.name ?? templateId
}

/** 로그를 재생하며 최종 HP 계산 */
function replayHp(
  players: BattleCharacter[],
  enemies: BattleCharacter[],
  logs: BattleLogEntry[]
): void {
  const all = [...players, ...enemies]
  const byKey = new Map<string, BattleCharacter>()
  for (const c of all) {
    byKey.set(`${c.team}-${c.templateId}`, c)
  }
  for (const log of logs) {
    if ((log.type !== 'attack' && log.type !== 'reflect') || log.defenderHpAfter === undefined) continue
    if (log.targetKey) {
      const c = byKey.get(log.targetKey)
      if (c) c.hp = log.defenderHpAfter
    }
  }
}
