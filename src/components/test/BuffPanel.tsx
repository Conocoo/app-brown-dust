// STEP 5 테스트 패널: 버프/상태효과 검증
import { useState } from 'react'
import { getAllBuffs, getBuffByCode } from '../../data/buffs'
import {
  createBuffInstance,
  getMaxTurn,
  getRemainTurn,
  isEndBuff,
  isSilenceIgnore,
  isReflectIgnore,
  isInitTurnIgnore,
  isCopyIgnore,
  hasSilence,
  hasTaunt,
  hasChaos,
  findDuplicateBuff,
  applyGrazeToNewBuff,
  getMagicValue,
} from '../../logic/buff'
import type { BuffInstance } from '../../logic/buff'

const CATEGORY_LABEL: Record<number, string> = { 1: '버프', 2: '디버프' }

export default function BuffPanel() {
  const [searchCode, setSearchCode] = useState('')
  const [activeBuffs, setActiveBuffs] = useState<BuffInstance[]>([])
  const [addCode, setAddCode] = useState('')
  const [addCreator, setAddCreator] = useState('A')
  const [turnType, setTurnType] = useState(0)
  const [mvMode, setMvMode] = useState(0)
  const [mvValue, setMvValue] = useState(1.0)
  const [mvAtk, setMvAtk] = useState(1000)
  const [mvHp, setMvHp] = useState(5000)
  const [mvMaxHp, setMvMaxHp] = useState(5000)

  const allBuffs = getAllBuffs()

  // 버프 코드로 검색
  const code = parseInt(searchCode)
  const found = !isNaN(code) ? getBuffByCode(code) : null

  // 버프 추가
  function addBuff() {
    const c = parseInt(addCode)
    if (isNaN(c)) return
    const data = getBuffByCode(c)
    if (!data) return

    const newBuff = createBuffInstance(data, 'owner1', addCreator)
    applyGrazeToNewBuff(newBuff)

    // 중복 체크
    const dup = findDuplicateBuff(activeBuffs, newBuff)
    const updated = dup
      ? activeBuffs.filter(b => b.instanceId !== dup.instanceId)
      : [...activeBuffs]
    setActiveBuffs([...updated, newBuff])
  }

  // 버프 제거
  function removeBuff(id: string) {
    setActiveBuffs(prev => prev.filter(b => b.instanceId !== id))
  }

  // 턴 진행
  function advanceTurn() {
    setActiveBuffs(prev => {
      const updated = prev.map(b => {
        const copy = { ...b }
        if (copy.data.turnType === turnType) {
          copy.currentTurn = copy.currentTurn + 1
        }
        return copy
      })
      return updated.filter(b => !isEndBuff(b))
    })
  }

  // magicValue 계산 데모
  const source = {
    atk: mvAtk, hp: mvHp, maxHp: mvMaxHp,
    supportPower: 500, def: 0.3, critRate: 0.15,
    agility: 0.1, baseHp: mvMaxHp, dodgeReduceRate: 0.35, counterRate: 0,
  }
  const mvResult = getMagicValue(mvMode, mvValue, source, source)

  const silenceActive = hasSilence(activeBuffs)
  const tauntActive = hasTaunt(activeBuffs)
  const chaosActive = hasChaos(activeBuffs)

  return (
    <div className="test-panel">
      <h2>버프/상태효과 검증</h2>

      {/* 버프 검색 */}
      <section className="test-section">
        <h3>버프 데이터 조회</h3>
        <div className="search-row">
          <span style={{ color: '#aaa', marginRight: '0.5rem' }}>총 버프: {allBuffs.length}개</span>
          <input
            className="test-input"
            type="number"
            placeholder="버프 코드 입력"
            value={searchCode}
            onChange={e => setSearchCode(e.target.value)}
            style={{ width: '120px' }}
          />
        </div>
        {found ? (
          <table className="stat-table" style={{ marginTop: '0.5rem' }}>
            <tbody>
              <tr><td>코드</td><td>{found.code}</td></tr>
              <tr><td>타입</td><td>{CATEGORY_LABEL[found.categoryRaw] ?? found.categoryRaw}</td></tr>
              <tr><td>subType</td><td>{found.subType} (0x{found.subType.toString(16).toUpperCase()})</td></tr>
              <tr><td>턴</td><td>{found.turn >= 1000 ? '무한' : found.turn}</td></tr>
              <tr><td>turnType</td><td>{found.turnType}</td></tr>
              <tr><td>classType</td><td>{found.classType}</td></tr>
              <tr><td>magicValue1</td><td>{found.magicValue1}</td></tr>
              <tr><td>magicValue2</td><td>{found.magicValue2}</td></tr>
              <tr><td>valueBaseType</td><td>{found.valueBaseType} (모드)</td></tr>
              <tr><td>groupCode</td><td>{found.groupCode}</td></tr>
              <tr><td>overLap</td><td>{found.overLap}</td></tr>
              <tr><td>category</td><td>{found.category}</td></tr>
              <tr><td>ignoreType</td><td>
                {found.ignoreType}
                {isSilenceIgnore(found.ignoreType) ? ' [침묵면역]' : ''}
                {isReflectIgnore(found.ignoreType) ? ' [반사면역]' : ''}
                {isInitTurnIgnore(found.ignoreType) ? ' [턴리셋면역]' : ''}
                {isCopyIgnore(found.ignoreType) ? ' [복사면역]' : ''}
              </td></tr>
            </tbody>
          </table>
        ) : searchCode ? (
          <p style={{ color: '#e94560' }}>코드 {searchCode} 버프 없음</p>
        ) : null}
      </section>

      {/* 활성 버프 시뮬레이션 */}
      <section className="test-section">
        <h3>활성 버프 시뮬레이션</h3>

        <div className="search-row" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
          <input
            className="test-input"
            type="number"
            placeholder="버프 코드"
            value={addCode}
            onChange={e => setAddCode(e.target.value)}
            style={{ width: '100px' }}
          />
          <select
            className="test-input"
            value={addCreator}
            onChange={e => setAddCreator(e.target.value)}
            style={{ width: '80px' }}
          >
            <option value="A">시전자 A</option>
            <option value="B">시전자 B</option>
            <option value="C">시전자 C</option>
          </select>
          <button className="test-btn" onClick={addBuff}>버프 추가</button>
          <span style={{ color: '#aaa', marginLeft: '1rem' }}>턴 타입:</span>
          <input
            className="test-input"
            type="number"
            value={turnType}
            onChange={e => setTurnType(Number(e.target.value))}
            style={{ width: '50px' }}
          />
          <button className="test-btn" onClick={advanceTurn}>턴 진행</button>
          <button className="test-btn" onClick={() => setActiveBuffs([])}>초기화</button>
        </div>

        {/* 상태 플래그 */}
        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem' }}>
          <span style={{ color: silenceActive ? '#e94560' : '#555' }}>침묵: {silenceActive ? '✅' : '-'}</span>
          <span style={{ color: tauntActive ? '#f5a623' : '#555' }}>도발: {tauntActive ? '✅' : '-'}</span>
          <span style={{ color: chaosActive ? '#9b59b6' : '#555' }}>혼란: {chaosActive ? '✅' : '-'}</span>
        </div>

        {activeBuffs.length === 0 ? (
          <p style={{ color: '#555', marginTop: '0.5rem' }}>활성 버프 없음</p>
        ) : (
          <table className="stat-table" style={{ marginTop: '0.5rem' }}>
            <thead>
              <tr>
                <th>코드</th>
                <th>타입</th>
                <th>subType</th>
                <th>시전자</th>
                <th>경과/최대</th>
                <th>잔여</th>
                <th>상태</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {activeBuffs.map(b => (
                <tr key={b.instanceId}>
                  <td>{b.buffCode}</td>
                  <td>{CATEGORY_LABEL[b.data.categoryRaw] ?? b.data.category}</td>
                  <td>0x{b.data.subType.toString(16).toUpperCase()}</td>
                  <td>{b.creatorKey}</td>
                  <td>{b.currentTurn}/{getMaxTurn(b) >= 1000 ? '∞' : getMaxTurn(b)}</td>
                  <td>{getRemainTurn(b) >= 1000 ? '∞' : getRemainTurn(b)}</td>
                  <td style={{ color: isEndBuff(b) ? '#e94560' : '#4caf50' }}>
                    {isEndBuff(b) ? '종료' : '활성'}
                  </td>
                  <td>
                    <button
                      className="test-btn"
                      onClick={() => removeBuff(b.instanceId)}
                      style={{ padding: '0.1rem 0.4rem', fontSize: '0.75rem' }}
                    >제거</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* magicValue 계산기 */}
      <section className="test-section">
        <h3>magicValue 계산기 (27 모드)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div>
            <label style={{ color: '#aaa', display: 'block', fontSize: '0.8rem' }}>모드 (valueBaseType)</label>
            <input className="test-input" type="number" min={0} max={26}
              value={mvMode} onChange={e => setMvMode(Number(e.target.value))} style={{ width: '70px' }} />
          </div>
          <div>
            <label style={{ color: '#aaa', display: 'block', fontSize: '0.8rem' }}>magicValue</label>
            <input className="test-input" type="number" step={0.01}
              value={mvValue} onChange={e => setMvValue(Number(e.target.value))} style={{ width: '90px' }} />
          </div>
          <div>
            <label style={{ color: '#aaa', display: 'block', fontSize: '0.8rem' }}>ATK</label>
            <input className="test-input" type="number"
              value={mvAtk} onChange={e => setMvAtk(Number(e.target.value))} style={{ width: '90px' }} />
          </div>
          <div>
            <label style={{ color: '#aaa', display: 'block', fontSize: '0.8rem' }}>현재 HP</label>
            <input className="test-input" type="number"
              value={mvHp} onChange={e => setMvHp(Number(e.target.value))} style={{ width: '90px' }} />
          </div>
          <div>
            <label style={{ color: '#aaa', display: 'block', fontSize: '0.8rem' }}>최대 HP</label>
            <input className="test-input" type="number"
              value={mvMaxHp} onChange={e => setMvMaxHp(Number(e.target.value))} style={{ width: '90px' }} />
          </div>
        </div>
        <p style={{ color: '#aaa' }}>
          결과: <strong style={{ color: '#e94560', fontSize: '1.1rem' }}>{mvResult.toFixed(2)}</strong>
        </p>
        <p style={{ color: '#555', fontSize: '0.75rem' }}>
          * source = creator = 입력 스탯 (단순화). 실제 전투에서는 owner/creator가 분리됨.
        </p>
      </section>

      {/* ignoreType 참조표 */}
      <section className="test-section">
        <h3>ignoreType 참조</h3>
        <table className="stat-table">
          <thead>
            <tr><th>ignoreType</th><th>침묵면역</th><th>반사면역</th><th>턴리셋면역</th><th>복사면역</th></tr>
          </thead>
          <tbody>
            {[0,1,2,3,4,5,6,7,8,9,10,11].map(n => (
              <tr key={n}>
                <td>{n}</td>
                <td>{isSilenceIgnore(n) ? '✅' : '-'}</td>
                <td>{isReflectIgnore(n) ? '✅' : '-'}</td>
                <td>{isInitTurnIgnore(n) ? '✅' : '-'}</td>
                <td>{isCopyIgnore(n) ? '✅' : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
