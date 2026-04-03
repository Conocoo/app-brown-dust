import { useState, useEffect, useRef } from 'react'
import Board from './components/Board'
import MercenaryPicker from './components/MercenaryPicker'
import BattleLog from './components/BattleLog'
import BattleControls from './components/BattleControls'
import DataPanel from './components/test/DataPanel'
import StatPanel from './components/test/StatPanel'
import DamagePanel from './components/test/DamagePanel'
import BuffPanel from './components/test/BuffPanel'
import TargetingPanel from './components/test/TargetingPanel'
import DeathPanel from './components/test/DeathPanel'
import SkillPanel from './components/test/SkillPanel'
import BattleSimPanel from './components/test/BattleSimPanel'
import { getAllMercenaries } from './data/mercenaries'
import { simulateBattle, createBattleChar } from './logic/battle'
import type { BattleCharacter, BattleLogEntry } from './types/battle'
import './App.css'

// ─── 타입 ─────────────────────────────────────────────────

type MainTab = 'battle' | 'dex' | 'test'
type TestPanel = 'data' | 'stat' | 'damage' | 'buff' | 'targeting' | 'death' | 'skill' | 'battle_sim'
type GamePhase = 'placing' | 'battling' | 'result'

interface CharSnapshot { hp: number; isDead: boolean }
type BattleSnapshot = Map<string, CharSnapshot>

// ─── 상수 ─────────────────────────────────────────────────

const TEST_MENU: [TestPanel, string][] = [
  ['data', '데이터'],
  ['stat', '스탯 계산'],
  ['damage', '데미지'],
  ['buff', '버프/상태효과'],
  ['targeting', '타겟팅'],
  ['death', '사망 체인'],
  ['skill', '스킬 실행'],
  ['battle_sim', '전투 시뮬레이션'],
]

// ─── 스냅샷 빌더 ──────────────────────────────────────────

function buildSnapshots(
  charsA: BattleCharacter[],
  charsB: BattleCharacter[],
  log: BattleLogEntry[]
): BattleSnapshot[] {
  const initial: BattleSnapshot = new Map()
  for (const c of [...charsA, ...charsB]) {
    initial.set(c.key, { hp: c.hp, isDead: false })
  }

  const snaps: BattleSnapshot[] = [initial]
  let cur = new Map(initial)

  for (const entry of log) {
    cur = new Map(cur)

    if (entry.type === 'attack' && entry.targetKey && entry.damage !== undefined) {
      const s = cur.get(entry.targetKey)
      if (s) cur.set(entry.targetKey, { ...s, hp: Math.max(0, s.hp - entry.damage) })
    }

    if (entry.type === 'death') {
      const s = cur.get(entry.charKey)
      if (s) cur.set(entry.charKey, { ...s, isDead: true })
    }

    if ((entry.type === 'revival' || entry.type === 'instead_death') && entry.restoreHp !== undefined) {
      const s = cur.get(entry.charKey)
      if (s) cur.set(entry.charKey, { hp: entry.restoreHp, isDead: false })
    }

    snaps.push(cur)
  }

  return snaps
}

// ─── 앱 ───────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState<MainTab>('battle')
  const [testPanel, setTestPanel] = useState<TestPanel>('data')

  // 배치 상태
  const [phase, setPhase] = useState<GamePhase>('placing')
  const [slotsA, setSlotsA] = useState<(string | null)[]>(Array(9).fill(null))
  const [slotsB, setSlotsB] = useState<(string | null)[]>(Array(9).fill(null))
  const [selectedCell, setSelectedCell] = useState<{ team: 'A' | 'B'; idx: number } | null>(null)

  // 전투 상태
  const [charsA, setCharsA] = useState<BattleCharacter[]>([])
  const [charsB, setCharsB] = useState<BattleCharacter[]>([])
  const [battleLog, setBattleLog] = useState<BattleLogEntry[]>([])
  const [snapshots, setSnapshots] = useState<BattleSnapshot[]>([])
  const [winner, setWinner] = useState<string>('')
  const [logIdx, setLogIdx] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(300)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 메르센 메타 맵 (배치 모드용)
  const mercMeta = useRef<Map<string, { name: string; emoji: string }>>(
    new Map(getAllMercenaries().map(m => [m.id, { name: m.name, emoji: m.emoji }]))
  )

  // ─── 재생 타이머 ─────────────────────────────────────────

  useEffect(() => {
    if (!isPlaying) return
    if (logIdx >= battleLog.length) {
      setIsPlaying(false)
      setPhase('result')
      return
    }

    if (speed === 0) {
      // 최대 속도: 전부 한번에
      setLogIdx(battleLog.length)
      setIsPlaying(false)
      setPhase('result')
      return
    }

    timerRef.current = setTimeout(() => {
      setLogIdx(prev => prev + 1)
    }, speed)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isPlaying, logIdx, battleLog.length, speed])

  // ─── 전투 시작 ───────────────────────────────────────────

  function startBattle() {
    const a = slotsA
      .map((id, i) => id ? createBattleChar(id, 'A', 115, [null, null, null], Math.floor(i / 3), i % 3) : null)
      .filter((c): c is BattleCharacter => c !== null)

    const b = slotsB
      .map((id, i) => id ? createBattleChar(id, 'B', 115, [null, null, null], Math.floor(i / 3), i % 3) : null)
      .filter((c): c is BattleCharacter => c !== null)

    if (a.length === 0 || b.length === 0) return

    // 초기 스냅샷을 시뮬 전에 저장해야 하므로 먼저 초기 HP 기록
    const initHps = new Map([...a, ...b].map(c => [c.key, c.hp]))

    const res = simulateBattle(a, b, Date.now())

    // 시뮬 후 char.hp는 최종 값. 스냅샷 빌더를 위해 초기 HP를 복원
    for (const c of [...a, ...b]) {
      c.hp = initHps.get(c.key) ?? c.hp
    }

    const snaps = buildSnapshots(a, b, res.log)

    setCharsA(a)
    setCharsB(b)
    setBattleLog(res.log)
    setSnapshots(snaps)
    setWinner(
      res.winner === 'draw' ? '무승부' :
      res.winner === 'A' ? 'A팀 승리' : 'B팀 승리'
    )
    setLogIdx(0)
    setIsPlaying(true)
    setPhase('battling')
  }

  // ─── 현재 스냅샷 ─────────────────────────────────────────

  const currentSnapshot = snapshots[logIdx] ?? snapshots[snapshots.length - 1] ?? new Map()

  // 현재 행동 중인 캐릭터 key (turn_start 엔트리 추적)
  const currentKey = (() => {
    for (let i = logIdx - 1; i >= 0; i--) {
      if (battleLog[i].type === 'turn_start') return battleLog[i].charKey
    }
    return ''
  })()

  // ─── 배치 핸들러 ─────────────────────────────────────────

  function handleCellClick(team: 'A' | 'B', idx: number) {
    const slots = team === 'A' ? slotsA : slotsB
    if (selectedCell?.team === team && selectedCell.idx === idx) {
      // 이미 선택된 셀 클릭 → 선택 해제 / 비우기
      const setter = team === 'A' ? setSlotsA : setSlotsB
      setter(prev => prev.map((v, i) => i === idx ? null : v))
      setSelectedCell(null)
    } else if (slots[idx]) {
      // 채워진 셀: 제거
      const setter = team === 'A' ? setSlotsA : setSlotsB
      setter(prev => prev.map((v, i) => i === idx ? null : v))
      setSelectedCell(null)
    } else {
      setSelectedCell({ team, idx })
    }
  }

  function handlePickerSelect(mercId: string) {
    if (!selectedCell) return
    const setter = selectedCell.team === 'A' ? setSlotsA : setSlotsB
    setter(prev => prev.map((v, i) => i === selectedCell.idx ? mercId : v))
    setSelectedCell(null)
  }

  function resetGame() {
    setPhase('placing')
    setSlotsA(Array(9).fill(null))
    setSlotsB(Array(9).fill(null))
    setSelectedCell(null)
    setBattleLog([])
    setSnapshots([])
    setLogIdx(0)
    setIsPlaying(false)
  }

  const validA = slotsA.filter(Boolean).length
  const validB = slotsB.filter(Boolean).length

  // ─── 렌더 ─────────────────────────────────────────────────

  return (
    <div className="app">
      <header className="app-header">
        <h1>브라운더스트 전투 시뮬레이터</h1>
        <nav className="tab-nav">
          <button className={tab === 'battle' ? 'tab active' : 'tab'} onClick={() => setTab('battle')}>전투</button>
          <button className={tab === 'dex' ? 'tab active' : 'tab'} onClick={() => setTab('dex')}>도감</button>
          <button className={tab === 'test' ? 'tab active' : 'tab'} onClick={() => setTab('test')}>🔧 테스트</button>
        </nav>
      </header>

      <main className="app-main">
        {/* ── 전투 탭 ── */}
        {tab === 'battle' && (
          <div>
            {/* 배치 단계 */}
            {phase === 'placing' && (
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                {/* 용병 픽커 */}
                <MercenaryPicker
                  onSelect={handlePickerSelect}
                  selectedId={selectedCell ? (selectedCell.team === 'A' ? slotsA : slotsB)[selectedCell.idx] : null}
                />

                {/* 두 팀 보드 */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#888' }}>
                    {selectedCell
                      ? `${selectedCell.team}팀 슬롯 ${selectedCell.idx + 1} 선택됨 — 용병을 클릭하세요`
                      : '슬롯을 클릭하여 용병 배치 / 다시 클릭하면 제거'}
                  </div>

                  <div style={{ display: 'flex', gap: '3rem' }}>
                    <Board
                      label="A팀"
                      slots={slotsA}
                      mercMeta={mercMeta.current}
                      mode="placing"
                      selectedIdx={selectedCell?.team === 'A' ? selectedCell.idx : undefined}
                      onCellClick={idx => handleCellClick('A', idx)}
                    />
                    <Board
                      label="B팀"
                      slots={slotsB}
                      mercMeta={mercMeta.current}
                      mode="placing"
                      selectedIdx={selectedCell?.team === 'B' ? selectedCell.idx : undefined}
                      onCellClick={idx => handleCellClick('B', idx)}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <button
                      className="test-btn"
                      onClick={startBattle}
                      disabled={validA === 0 || validB === 0}
                      style={{ fontSize: '1rem', padding: '0.6rem 2rem' }}
                    >
                      ⚔ 전투 시작
                    </button>
                    <span style={{ color: '#888', fontSize: '0.85rem' }}>
                      A팀 {validA}명 vs B팀 {validB}명
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 전투 단계 */}
            {(phase === 'battling' || phase === 'result') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* 컨트롤 */}
                {phase === 'battling' && (
                  <BattleControls
                    isPlaying={isPlaying}
                    speed={speed}
                    currentIdx={logIdx}
                    totalSteps={battleLog.length}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onStep={() => setLogIdx(prev => Math.min(prev + 1, battleLog.length))}
                    onStepBack={() => { setIsPlaying(false); setLogIdx(prev => Math.max(prev - 1, 0)) }}
                    onSpeedChange={setSpeed}
                    onReset={() => { setIsPlaying(false); setLogIdx(0) }}
                  />
                )}

                {/* 결과 배너 */}
                {phase === 'result' && (
                  <div style={{
                    background: '#16213e',
                    borderRadius: '8px',
                    padding: '1rem 2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#e94560' }}>
                      {winner}
                    </div>
                    <button className="test-btn" onClick={resetGame} style={{ fontSize: '0.9rem' }}>
                      다시 하기
                    </button>
                  </div>
                )}

                {/* 보드 + 로그 */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <Board
                    label="A팀"
                    chars={charsA}
                    snapshot={currentSnapshot}
                    mode="battle"
                    currentKey={currentKey}
                  />

                  <BattleLog log={battleLog} currentIdx={logIdx} />

                  <Board
                    label="B팀"
                    chars={charsB}
                    snapshot={currentSnapshot}
                    mode="battle"
                    currentKey={currentKey}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── 도감 탭 ── */}
        {tab === 'dex' && (
          <div className="placeholder"><p>도감 탭 — 추후 구현 예정</p></div>
        )}

        {/* ── 테스트 탭 ── */}
        {tab === 'test' && (
          <div className="test-layout">
            <aside className="test-sidebar">
              <h2>테스트 패널</h2>
              <ul>
                {TEST_MENU.map(([id, label]) => (
                  <li key={id}>
                    <button
                      className={testPanel === id ? 'test-menu-item active' : 'test-menu-item'}
                      onClick={() => setTestPanel(id)}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            <section className="test-content">
              {testPanel === 'data' && <DataPanel />}
              {testPanel === 'stat' && <StatPanel />}
              {testPanel === 'damage' && <DamagePanel />}
              {testPanel === 'buff' && <BuffPanel />}
              {testPanel === 'targeting' && <TargetingPanel />}
              {testPanel === 'death' && <DeathPanel />}
              {testPanel === 'skill' && <SkillPanel />}
              {testPanel === 'battle_sim' && <BattleSimPanel />}
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
