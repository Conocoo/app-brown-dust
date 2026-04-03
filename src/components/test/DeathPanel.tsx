// STEP 7 테스트 패널: 사망 체인 검증
import { useState } from 'react'
import { processDieCheck, processInstantDeath, processInstantDeath2 } from '../../logic/death'
import type { BattleCharacter, BattleLogEntry } from '../../types/battle'
import { createBuffInstance } from '../../logic/buff'
import { getBuffByCode } from '../../data/buffs'

type Scenario = 'normal' | 'instead_death' | 'rebirth' | 'revival' | 'instant'

const SCENARIO_LABELS: Record<Scenario, string> = {
  normal: '일반 사망',
  instead_death: '대신죽기',
  rebirth: '환생',
  revival: '부활',
  instant: '즉사',
}

function makeChar(name: string, hp: number, maxHp: number): BattleCharacter {
  return {
    key: 'test1',
    id: 'test',
    name,
    type: 'attacker',
    team: 'A',
    row: 0,
    col: 0,
    hp,
    maxHp,
    atk: 1000,
    supportPower: 0,
    def: 0,
    critRate: 0,
    critDamage: 0,
    agility: 0,
    piercing: 0,
    patience: 0,
    activeBuffs: [],
    order: 0,
    isCasting: false,
    skills: [],
    coolTimeCounters: {},
    tempHp: 0,
    imageId: '',
    emoji: '',
    runes: [null, null, null],
  }
}

export default function DeathPanel() {
  const [scenario, setScenario] = useState<Scenario>('normal')
  const [initialHp, setInitialHp] = useState(0)
  const [maxHp, setMaxHp] = useState(10000)
  const [damage, setDamage] = useState(1000)
  const [insteadCode, setInsteadCode] = useState('')
  const [revivalCode, setRevivalCode] = useState('')
  const [log, setLog] = useState<BattleLogEntry[]>([])
  const [result, setResult] = useState<string>('')
  const [finalHp, setFinalHp] = useState<number | null>(null)

  function runScenario() {
    const char = makeChar('테스트 캐릭터', Math.max(0, initialHp - damage), maxHp)
    const entries: BattleLogEntry[] = []

    // 시나리오별 버프 부착
    if (scenario === 'instead_death') {
      // subType=0x05 버프를 찾아 부착 (없으면 임의 구성)
      const code = parseInt(insteadCode)
      const data = !isNaN(code) ? getBuffByCode(code) : null
      if (data) {
        const buff = createBuffInstance(data, 'creator1', 'owner1')
        char.activeBuffs = [buff]
        entries.push({ type: 'skill_effect', charKey: 'creator1', detail: `대신죽기 버프(${code}) 부착` })
      } else {
        entries.push({ type: 'skill_effect', charKey: 'creator1', detail: '버프 코드 없음 — 시나리오 스킵' })
      }
    }

    if (scenario === 'revival') {
      const code = parseInt(revivalCode)
      const data = !isNaN(code) ? getBuffByCode(code) : null
      if (data) {
        const buff = createBuffInstance(data, 'creator1', 'owner1')
        char.activeBuffs = [buff]
        entries.push({ type: 'skill_effect', charKey: 'creator1', detail: `부활 버프(${code}) 부착` })
      } else {
        entries.push({ type: 'skill_effect', charKey: 'creator1', detail: '버프 코드 없음 — 시나리오 스킵' })
      }
    }

    // 사망 체인 실행
    if (scenario === 'instant') {
      processInstantDeath(char, entries)
      setResult('즉사 → 사망 (대신죽기/부활 불가)')
    } else {
      const res = processDieCheck(char, false, entries)
      setResult(
        res.survived
          ? `생존 (${res.reason})`
          : `사망 (${res.reason})`
      )
    }

    setFinalHp(char.hp)
    setLog(entries)
  }

  function runInstant2() {
    const char = makeChar('테스트 캐릭터', 0, maxHp)
    const entries: BattleLogEntry[] = []
    const res = processInstantDeath2(char, entries)
    setResult(res.survived ? `생존 (${res.reason})` : '사망 (즉사2)')
    setFinalHp(char.hp)
    setLog(entries)
  }

  return (
    <div className="test-panel">
      <h2>사망 체인 검증</h2>

      <section className="test-section">
        <h3>시나리오 설정</h3>
        <div className="search-row" style={{ gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          {(Object.keys(SCENARIO_LABELS) as Scenario[]).map(s => (
            <button
              key={s}
              className={`test-btn${scenario === s ? '' : ''}`}
              style={{ background: scenario === s ? '#e94560' : '#2a2a4a' }}
              onClick={() => setScenario(s)}
            >
              {SCENARIO_LABELS[s]}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div>
            <label style={{ color: '#aaa', display: 'block', fontSize: '0.8rem' }}>초기 HP</label>
            <input className="test-input" type="number" value={initialHp}
              onChange={e => setInitialHp(Number(e.target.value))} style={{ width: '90px' }} />
          </div>
          <div>
            <label style={{ color: '#aaa', display: 'block', fontSize: '0.8rem' }}>최대 HP</label>
            <input className="test-input" type="number" value={maxHp}
              onChange={e => setMaxHp(Number(e.target.value))} style={{ width: '90px' }} />
          </div>
          <div>
            <label style={{ color: '#aaa', display: 'block', fontSize: '0.8rem' }}>데미지</label>
            <input className="test-input" type="number" value={damage}
              onChange={e => setDamage(Number(e.target.value))} style={{ width: '90px' }} />
          </div>
        </div>

        {scenario === 'instead_death' && (
          <div className="search-row">
            <label style={{ color: '#aaa', marginRight: '0.5rem', fontSize: '0.8rem' }}>대신죽기 버프 코드:</label>
            <input className="test-input" type="number" value={insteadCode}
              onChange={e => setInsteadCode(e.target.value)} style={{ width: '90px' }} />
            <span style={{ color: '#555', fontSize: '0.75rem', marginLeft: '0.5rem' }}>(subType=0x05 버프)</span>
          </div>
        )}
        {scenario === 'revival' && (
          <div className="search-row">
            <label style={{ color: '#aaa', marginRight: '0.5rem', fontSize: '0.8rem' }}>부활 버프 코드:</label>
            <input className="test-input" type="number" value={revivalCode}
              onChange={e => setRevivalCode(e.target.value)} style={{ width: '90px' }} />
            <span style={{ color: '#555', fontSize: '0.75rem', marginLeft: '0.5rem' }}>(subType=0x06 버프)</span>
          </div>
        )}

        <div className="search-row" style={{ gap: '0.5rem', marginTop: '0.5rem' }}>
          <button className="test-btn" onClick={runScenario}>시뮬레이션</button>
          {scenario === 'instant' && (
            <button className="test-btn" onClick={runInstant2}>즉사2 (부활 가능)</button>
          )}
        </div>
      </section>

      {result && (
        <section className="test-section">
          <h3>결과</h3>
          <p style={{ fontSize: '1.1rem', color: result.includes('생존') ? '#4caf50' : '#e94560' }}>
            {result}
          </p>
          {finalHp !== null && (
            <p style={{ color: '#aaa' }}>최종 HP: {finalHp} / {maxHp}</p>
          )}
          {log.length > 0 && (
            <pre className="test-output">
              {log.map((e, i) => `[${i+1}] ${e.type}: ${e.detail ?? ''}`).join('\n')}
            </pre>
          )}
        </section>
      )}

      <section className="test-section">
        <h3>사망 체인 5단계</h3>
        <pre className="test-output" style={{ fontSize: '0.75rem' }}>
{`ProcessDieCheck(target, isDelayDamage=false)
  │
  ├─ HP > 0 → 생존 ✓
  │
  ├─ [1] 대신죽기 (subType=0x05)
  │     → HP 100% 회복 + 버프 소모 → 생존 ✓
  │
  ├─ [2] 환생 (subType=0x1E)
  │     → HP 회복 + 버프 전체 초기화 → 생존 ✓
  │
  ├─ [3] 사망 콜백 (DieCallBack)
  │     → 콜백 버프 실행 (생존 불가)
  │
  ├─ [4] 부활 (subType=0x06)
  │     → HP 부분 회복 + 버프 초기화 → 생존 ✓
  │
  └─ [5] 진짜 사망
        → 버프 전체 해제 + 사망 처리`}
        </pre>
      </section>
    </div>
  )
}
