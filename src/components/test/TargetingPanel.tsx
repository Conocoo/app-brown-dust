// STEP 6 테스트 패널: 타겟팅 검증
import { useState } from 'react'
import { WELL512 } from '../../logic/random'
import {
  searchEnemyTarget,
  searchMultiTarget,
  COL_COUNT,
  ROW_COUNT,
} from '../../logic/targeting'
import type { GridChar } from '../../logic/targeting'

const SEARCH_TYPE_LABELS: Record<number, string> = {
  1: '전방 첫 번째 (enemy_front)',
  2: '최후방 (enemy_back)',
  3: '랜덤 (enemy_random)',
  4: '전방 두 번째 (enemy_second)',
  5: '다음 턴 (next_ally)',
  7: '자기 자신 (self)',
  8: '혼란/랜덤 (chaos_random)',
  9: '전방 세 번째 (enemy_third)',
}

const RANGE_TYPE_LABELS: Record<number, string> = {
  1: '단일',
  2: '전방 직선 (front_n)',
  3: '십자형 (cross)',
  4: '정사각형 NxN (area_n)',
  5: '가로 직선 (vertical)',
  6: '마름모형 (diamond)',
  7: '후방 직선 (back_n)',
  8: 'X자형 (x_shape)',
  9: '세로 열 (vertical_line)',
  10: '소형 십자 (small_cross)',
  11: '가로 전체 (horizontal)',
  12: '체이닝 (chaining)',
  13: '전체 (all)',
  14: '전방 확장 (front_extend)',
}

const TOTAL_CELLS = ROW_COUNT * COL_COUNT  // 18칸 (3×6)

function emptyChar(idx: number): GridChar {
  return {
    gridIndex: idx,
    key: `e${idx}`,
    isDead: true,
    hasTaunt: false,
    hasFocusFire: false,
    hasAggro: false,
    hasChaos: false,
    hasChaosBuff: false,
    hasTargetExcept: false,
    searchTypeOverride: null,
  }
}

function liveChar(idx: number, key: string): GridChar {
  return { ...emptyChar(idx), key, isDead: false }
}

export default function TargetingPanel() {
  const [grid, setGrid] = useState<GridChar[]>(() =>
    Array.from({ length: TOTAL_CELLS }, (_, i) => emptyChar(i))
  )
  const [attackerIdx, setAttackerIdx] = useState<number | null>(null)
  const [searchType, setSearchType] = useState(1)
  const [rangeType, setRangeType] = useState(1)
  const [rangeSize, setRangeSize] = useState(1)
  const [highlights, setHighlights] = useState<Set<number>>(new Set())
  const [mainTarget, setMainTarget] = useState<number>(-1)

  function toggleCell(idx: number) {
    setGrid(prev => {
      const next = [...prev]
      const cur = next[idx]
      if (cur.isDead) {
        next[idx] = liveChar(idx, `u${idx}`)
      } else {
        next[idx] = emptyChar(idx)
      }
      return next
    })
    setHighlights(new Set())
    setMainTarget(-1)
  }

  function setAttacker(idx: number) {
    setAttackerIdx(prev => prev === idx ? null : idx)
    setHighlights(new Set())
    setMainTarget(-1)
  }

  function runSearch() {
    if (attackerIdx === null) return
    const owner = liveChar(attackerIdx, 'attacker')
    const rng = new WELL512(12345)

    const main = searchEnemyTarget(owner, grid, searchType, rng)
    setMainTarget(main)

    if (main === -1) {
      setHighlights(new Set())
      return
    }

    const multi = searchMultiTarget(main, grid, rangeType, rangeSize)
    setHighlights(new Set(multi))
  }

  function resetGrid() {
    setGrid(Array.from({ length: TOTAL_CELLS }, (_, i) => emptyChar(i)))
    setAttackerIdx(null)
    setHighlights(new Set())
    setMainTarget(-1)
  }

  function setCellFlag(idx: number, flag: keyof GridChar, value: boolean) {
    setGrid(prev => {
      const next = [...prev]
      next[idx] = { ...next[idx], [flag]: value }
      return next
    })
  }

  const selectedCell = attackerIdx !== null ? grid[attackerIdx] : null

  return (
    <div className="test-panel">
      <h2>타겟팅 검증</h2>

      <section className="test-section">
        <h3>3×6 그리드 (클릭: 유닛 배치, 더블클릭: 공격자 지정)</h3>
        <p style={{ color: '#888', fontSize: '0.8rem' }}>
          클릭 = 유닛 on/off | Shift+클릭 = 공격자 지정 | 배치 후 "타겟 검색" 실행
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COL_COUNT}, 48px)`, gap: '4px', marginBottom: '1rem' }}>
          {grid.map((cell, idx) => {
            const isAttacker = attackerIdx === idx
            const isMain = mainTarget === idx
            const isHighlight = highlights.has(idx)
            let bg = '#1a1a2e'
            if (isAttacker) bg = '#1e3a5f'
            else if (isMain) bg = '#e94560'
            else if (isHighlight) bg = '#f5a623'
            else if (!cell.isDead) bg = '#2d4a3e'

            return (
              <div
                key={idx}
                onClick={(e) => e.shiftKey ? setAttacker(idx) : toggleCell(idx)}
                style={{
                  width: 48, height: 48, border: '1px solid #333',
                  background: bg, cursor: 'pointer', borderRadius: 4,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', color: '#fff',
                  userSelect: 'none',
                }}
              >
                <span>{`R${Math.floor(idx / COL_COUNT)}C${idx % COL_COUNT}`}</span>
                {isAttacker && <span style={{ color: '#7ec8e3' }}>ATK</span>}
                {!cell.isDead && !isAttacker && <span style={{ color: '#4caf50' }}>●</span>}
                {cell.hasTaunt && <span style={{ color: '#f5a623' }}>도발</span>}
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          <button className="test-btn" onClick={runSearch}>타겟 검색</button>
          <button className="test-btn" onClick={resetGrid}>초기화</button>
        </div>

        {attackerIdx !== null && (
          <p style={{ color: '#7ec8e3', fontSize: '0.85rem' }}>
            공격자: R{Math.floor(attackerIdx / COL_COUNT)}C{attackerIdx % COL_COUNT}
            {mainTarget >= 0 && ` → 메인 타겟: R${Math.floor(mainTarget / COL_COUNT)}C${mainTarget % COL_COUNT}`}
            {mainTarget === -1 && highlights.size === 0 && ' → 타겟 없음'}
          </p>
        )}

        {selectedCell && !selectedCell.isDead && (
          <div style={{ marginTop: '0.5rem' }}>
            <span style={{ color: '#aaa', fontSize: '0.8rem' }}>선택 셀 R{Math.floor(attackerIdx! / COL_COUNT)}C{attackerIdx! % COL_COUNT} 버프: </span>
            {([
              ['hasTaunt', '도발'],
              ['hasFocusFire', '집중공격'],
              ['hasAggro', '광역어그로'],
            ] as [keyof GridChar, string][]).map(([flag, label]) => (
              <label key={flag} style={{ marginRight: '0.5rem', fontSize: '0.8rem', color: '#aaa' }}>
                <input
                  type="checkbox"
                  checked={!!selectedCell[flag]}
                  onChange={e => setCellFlag(attackerIdx!, flag, e.target.checked)}
                />
                {' '}{label}
              </label>
            ))}
          </div>
        )}
      </section>

      <section className="test-section">
        <h3>검색 설정</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ color: '#aaa', display: 'block', marginBottom: '0.3rem' }}>searchType</label>
            <select
              className="test-input"
              value={searchType}
              onChange={e => setSearchType(Number(e.target.value))}
            >
              {Object.entries(SEARCH_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{k}: {v}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ color: '#aaa', display: 'block', marginBottom: '0.3rem' }}>rangeType (actionType)</label>
            <select
              className="test-input"
              value={rangeType}
              onChange={e => setRangeType(Number(e.target.value))}
            >
              {Object.entries(RANGE_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{k}: {v}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ color: '#aaa', display: 'block', marginBottom: '0.3rem' }}>rangeSize</label>
            <input
              className="test-input"
              type="number"
              min={0}
              max={5}
              value={rangeSize}
              onChange={e => setRangeSize(Number(e.target.value))}
              style={{ width: '60px' }}
            />
          </div>
        </div>
      </section>

      <section className="test-section">
        <h3>타겟팅 우선순위</h3>
        <pre className="test-output" style={{ fontSize: '0.75rem' }}>
{`1. 도발(subType=9, targetType=1) 보유 적 → 즉시 반환
2. 소환수 원본 타겟 (creatorTarget)
3. 도발 비매칭 폴백 (tauntFallback)
4. 광역 어그로(subType=0x11) 매칭 → 즉시 반환
5. 광역 어그로 비매칭 폴백
6. 일반 searchType → SearchTarget()`}
        </pre>
      </section>
    </div>
  )
}
