import { useState, useCallback, useRef, useEffect } from 'react'
import type { BattleCharacter, GamePhase, BattleLogEntry } from './types/game'
import { characters } from './data/characters'
import { simulateBattle } from './logic/battle'
import Board from './components/Board'
import CharacterList from './components/CharacterList'
import OrderSetter from './components/OrderSetter'
import BattleLog from './components/BattleLog'
import './App.css'

const ROWS = 3
const COLS = 12
const PLAYER_COLS = 6

function createEmptyGrid(): (BattleCharacter | null)[][] {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null))
}

/** 상대 팀을 랜덤 배치 */
function placeEnemies(grid: (BattleCharacter | null)[][]): void {
  const shuffled = [...characters].sort(() => Math.random() - 0.5)
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
    grid[pos.row][pos.col] = {
      templateId: tmpl.id,
      name: tmpl.name,
      type: tmpl.type,
      hp: tmpl.maxHp,
      maxHp: tmpl.maxHp,
      atk: tmpl.atk,
      def: tmpl.def,
      emoji: tmpl.emoji,
      team: 'enemy',
      row: pos.row,
      col: pos.col,
      isCasting: false,
      order: i,
    }
  }
}

type DragSource =
  | { type: 'character'; id: string }
  | { type: 'cell'; row: number; col: number }
  | null

export default function App() {
  const [grid, setGrid] = useState<(BattleCharacter | null)[][]>(() => {
    const g = createEmptyGrid()
    placeEnemies(g)
    return g
  })
  const [phase, setPhase] = useState<GamePhase>('placing')
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
      if (phase !== 'placing') return
      if (col >= PLAYER_COLS) return

      const existing = grid[row][col]

      // 이미 배치된 캐릭터 좌클릭 → 선택 (정보 표시는 이후 구현)
      if (existing && existing.team === 'player') {
        setSelectedCell({ row, col })
        return
      }

      // 빈 셀에 선택된 캐릭터 배치
      if (selectedCharId) {
        const tmpl = characters.find((c) => c.id === selectedCharId)
        if (!tmpl) return
        setGrid((prev) => {
          const next = prev.map((r) => [...r])
          next[row][col] = {
            templateId: tmpl.id,
            name: tmpl.name,
            type: tmpl.type,
            hp: tmpl.maxHp,
            maxHp: tmpl.maxHp,
            atk: tmpl.atk,
            def: tmpl.def,
            emoji: tmpl.emoji,
            team: 'player',
            row,
            col,
            isCasting: false,
            order: -1,
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
          next[row][col] = null
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
    setDragSource({ type: 'character', id })
    setSelectedCharId(id)
  }, [])

  // 드래그: 셀에서 시작
  const handleDragStartFromCell = useCallback((row: number, col: number) => {
    setDragSource({ type: 'cell', row, col })
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
          const tmpl = characters.find((c) => c.id === dragSource.id)
          if (!tmpl) return next
          next[row][col] = {
            templateId: tmpl.id,
            name: tmpl.name,
            type: tmpl.type,
            hp: tmpl.maxHp,
            maxHp: tmpl.maxHp,
            atk: tmpl.atk,
            def: tmpl.def,
            emoji: tmpl.emoji,
            team: 'player',
            row,
            col,
            isCasting: false,
            order: -1,
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
      setDragSource(null)
      setSelectedCharId(null)
      setSelectedCell({ row, col })
    },
    [phase, dragSource]
  )

  // 드래그 종료
  useEffect(() => {
    const handleDragEnd = () => setDragSource(null)
    document.addEventListener('dragend', handleDragEnd)
    return () => document.removeEventListener('dragend', handleDragEnd)
  }, [])

  // 배치 완료 → 순서 지정 단계로
  const handleGoToOrdering = useCallback(() => {
    if (placedPlayers.length === 0) return
    const chars = placedPlayers.map((c) => ({ ...c, order: -1 }))
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
            row[i] = { ...row[i]!, hp: row[i]!.maxHp, isCasting: false }
          }
        }
      }
      const state = new Map<string, { hp: number; isCasting: boolean }>()
      for (const row of next) {
        for (const cell of row) {
          if (cell) {
            state.set(`${cell.team}-${cell.templateId}`, { hp: cell.maxHp, isCasting: false })
          }
        }
      }
      for (let i = 0; i < upTo && i < logs.length; i++) {
        const log = logs[i]
        if (log.type === 'attack' && log.defender && log.defenderHpAfter !== undefined) {
          state.forEach((val, key) => {
            const name = key.split('-').slice(1).join('-')
            if (log.defender!.includes(getNameFromTemplate(name))) {
              val.hp = log.defenderHpAfter!
            }
          })
        }
        if (log.type === 'casting' && log.message) {
          state.forEach((val, key) => {
            const name = getNameFromTemplate(key.split('-').slice(1).join('-'))
            if (log.message!.includes(name)) {
              val.isCasting = true
            }
          })
        }
      }
      for (const row of next) {
        for (let i = 0; i < row.length; i++) {
          if (row[i]) {
            const key = `${row[i]!.team}-${row[i]!.templateId}`
            const s = state.get(key)
            if (s) {
              row[i] = { ...row[i]!, hp: s.hp, isCasting: s.isCasting }
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

        const playersAlive = finalPlayers.some((c) => c.hp > 0)
        const enemiesAlive = finalEnemies.some((c) => c.hp > 0)

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

  // 다시 하기
  const handleReset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    const g = createEmptyGrid()
    placeEnemies(g)
    setGrid(g)
    setPhase('placing')
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

  return (
    <div className="app">
      <h1>브라운더스트 전투 시뮬레이터</h1>

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
            characters={characters}
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
  const found = characters.find((c) => c.id === templateId)
  return found?.name ?? templateId
}

/** 로그를 재생하며 최종 HP 계산 */
function replayHp(
  players: BattleCharacter[],
  enemies: BattleCharacter[],
  logs: BattleLogEntry[]
): void {
  for (const log of logs) {
    if (log.type !== 'attack' || !log.defender || log.defenderHpAfter === undefined) continue
    const all = [...players, ...enemies]
    for (const c of all) {
      if (log.defender.includes(c.name)) {
        c.hp = log.defenderHpAfter
      }
    }
  }
}
