// STEP 9 테스트 패널: 전투 시뮬레이션
import { useState } from 'react'
import { getAllMercenaries } from '../../data/mercenaries'
import { simulateBattle, createBattleChar } from '../../logic/battle'
import type { BattleLogEntry } from '../../types/battle'

type LogFilter = 'all' | 'attack' | 'death' | 'round'

const LOG_TYPE_COLORS: Record<string, string> = {
  round_start: '#7ec8e3',
  turn_start: '#888',
  casting: '#f5a623',
  attack: '#e8e8e8',
  skill_effect: '#b8e8b8',
  buff_applied: '#c8d8f8',
  buff_expired: '#aaa',
  death: '#e94560',
  revival: '#4caf50',
  instead_death: '#f5a623',
  battle_end: '#e94560',
}

export default function BattleSimPanel() {
  const mercs = getAllMercenaries()
  const [teamA, setTeamA] = useState<string[]>([''])
  const [teamB, setTeamB] = useState<string[]>([''])
  const [log, setLog] = useState<BattleLogEntry[]>([])
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<string>('')
  const [filter, setFilter] = useState<LogFilter>('all')

  function addSlot(team: 'A' | 'B') {
    if (team === 'A') setTeamA(prev => [...prev, ''])
    else setTeamB(prev => [...prev, ''])
  }

  function setSlot(team: 'A' | 'B', idx: number, val: string) {
    if (team === 'A') setTeamA(prev => prev.map((v, i) => i === idx ? val : v))
    else setTeamB(prev => prev.map((v, i) => i === idx ? val : v))
  }

  function removeSlot(team: 'A' | 'B', idx: number) {
    if (team === 'A') setTeamA(prev => prev.filter((_, i) => i !== idx))
    else setTeamB(prev => prev.filter((_, i) => i !== idx))
  }

  function runSim() {
    setRunning(true)
    setLog([])
    setResult('')

    const a = teamA.map((id, i) => id ? createBattleChar(id, 'A', 115, [null, null, null], Math.floor(i / 3), i % 3) : null).filter(Boolean) as ReturnType<typeof createBattleChar>[]
    const b = teamB.map((id, i) => id ? createBattleChar(id, 'B', 115, [null, null, null], Math.floor(i / 3), i % 3) : null).filter(Boolean) as ReturnType<typeof createBattleChar>[]

    const validA = a.filter(Boolean) as NonNullable<typeof a[0]>[]
    const validB = b.filter(Boolean) as NonNullable<typeof b[0]>[]

    if (validA.length === 0 || validB.length === 0) {
      setResult('양 팀 모두 최소 1명 필요')
      setRunning(false)
      return
    }

    const res = simulateBattle(validA, validB, 42)
    setLog(res.log)
    setResult(
      res.winner === 'draw'
        ? `무승부 (${res.rounds}라운드)`
        : `${res.winner}팀 승리 (${res.rounds}라운드)`
    )
    setRunning(false)
  }

  function filteredLog(): BattleLogEntry[] {
    if (filter === 'all') return log
    if (filter === 'round') return log.filter(e => e.type === 'round_start' || e.type === 'battle_end')
    if (filter === 'attack') return log.filter(e => e.type === 'attack')
    if (filter === 'death') return log.filter(e => e.type === 'death' || e.type === 'revival' || e.type === 'instead_death')
    return log
  }

  function MercSelect({ team, idx }: { team: 'A' | 'B'; idx: number }) {
    const val = team === 'A' ? teamA[idx] : teamB[idx]
    return (
      <div className="search-row" style={{ gap: '0.3rem', marginBottom: '0.3rem' }}>
        <select
          className="test-input"
          value={val}
          onChange={e => setSlot(team, idx, e.target.value)}
          style={{ flex: 1 }}
        >
          <option value="">-- 선택 --</option>
          {mercs.map(m => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.type})
            </option>
          ))}
        </select>
        <button
          className="test-btn"
          onClick={() => removeSlot(team, idx)}
          style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
        >✕</button>
      </div>
    )
  }

  return (
    <div className="test-panel">
      <h2>전투 시뮬레이션</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <section className="test-section">
          <h3>A팀</h3>
          {teamA.map((_, i) => <MercSelect key={i} team="A" idx={i} />)}
          {teamA.length < 9 && (
            <button className="test-btn" onClick={() => addSlot('A')} style={{ fontSize: '0.8rem' }}>+ 추가</button>
          )}
        </section>

        <section className="test-section">
          <h3>B팀</h3>
          {teamB.map((_, i) => <MercSelect key={i} team="B" idx={i} />)}
          {teamB.length < 9 && (
            <button className="test-btn" onClick={() => addSlot('B')} style={{ fontSize: '0.8rem' }}>+ 추가</button>
          )}
        </section>
      </div>

      <div className="search-row" style={{ gap: '0.5rem', marginBottom: '1rem' }}>
        <button className="test-btn" onClick={runSim} disabled={running}>
          {running ? '시뮬레이션 중...' : '시뮬레이션 실행'}
        </button>
      </div>

      {result && (
        <section className="test-section">
          <h3>결과</h3>
          <p style={{
            fontSize: '1.2rem', fontWeight: 'bold',
            color: result.includes('A팀') ? '#4caf50' : result.includes('B팀') ? '#e94560' : '#f5a623',
          }}>
            {result}
          </p>
        </section>
      )}

      {log.length > 0 && (
        <section className="test-section">
          <h3>전투 로그 ({log.length}개 항목)</h3>
          <div className="search-row" style={{ gap: '0.3rem', marginBottom: '0.5rem' }}>
            {(['all', 'round', 'attack', 'death'] as LogFilter[]).map(f => (
              <button
                key={f}
                className="test-btn"
                style={{ background: filter === f ? '#e94560' : '#2a2a4a', fontSize: '0.8rem' }}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? '전체' : f === 'round' ? '라운드' : f === 'attack' ? '공격' : '사망'}
              </button>
            ))}
          </div>
          <div className="test-output" style={{ maxHeight: '400px', overflowY: 'auto', fontSize: '0.75rem' }}>
            {filteredLog().map((entry, i) => (
              <div
                key={i}
                style={{
                  color: LOG_TYPE_COLORS[entry.type] ?? '#ccc',
                  borderBottom: entry.type === 'round_start' ? '1px solid #333' : undefined,
                  paddingTop: entry.type === 'round_start' ? '0.3rem' : undefined,
                }}
              >
                [{entry.type}] {entry.detail}
                {entry.damage !== undefined && ` — 데미지: ${entry.damage}`}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
