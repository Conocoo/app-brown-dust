// STEP 2 테스트 패널: 데이터 로드 통계 + 용병/스킬 검색
import { useState } from 'react'
import { getAllMercenaries, getMercenaryById, getMercenaryCount, getMercenarySkills } from '../../data/mercenaries'
import { getSkillCount } from '../../data/skills'
import { getBuffCount } from '../../data/buffs'
import { getRuneCount } from '../../data/runes'

export default function DataPanel() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<string | null>(null)

  function handleSearch() {
    const q = query.trim().toLowerCase()
    if (!q) return

    const mercs = getAllMercenaries()
    const found = mercs.find(
      (m) => m.id === q || m.name === query.trim() || m.code.toString() === q
    )

    if (found) {
      const skills = getMercenarySkills(found.id)
      setResult(JSON.stringify({ ...found, skills }, null, 2))
    } else {
      // id로 직접 시도
      const direct = getMercenaryById(q)
      setResult(direct ? JSON.stringify(direct, null, 2) : `"${query}" 용병을 찾지 못했습니다.`)
    }
  }

  const mercs = getAllMercenaries()
  const byType = {
    attacker: mercs.filter((m) => m.type === 'attacker').length,
    defender: mercs.filter((m) => m.type === 'defender').length,
    mage: mercs.filter((m) => m.type === 'mage').length,
    support: mercs.filter((m) => m.type === 'support').length,
  }
  const byStar: Record<number, number> = {}
  for (const m of mercs) {
    byStar[m.star] = (byStar[m.star] ?? 0) + 1
  }

  return (
    <div className="test-panel">
      <h2>데이터 레이어 검증</h2>

      <section className="test-section">
        <h3>로드 통계</h3>
        <table className="stat-table">
          <tbody>
            <tr><td>용병</td><td>{getMercenaryCount()}명</td><td className="expect">(기대: 325)</td></tr>
            <tr><td>스킬</td><td>{getSkillCount()}개</td><td className="expect">(기대: 8,923)</td></tr>
            <tr><td>버프</td><td>{getBuffCount()}개</td><td className="expect">(기대: 17,817)</td></tr>
            <tr><td>룬</td><td>{getRuneCount()}개</td><td className="expect">(기대: 3,130)</td></tr>
          </tbody>
        </table>
      </section>

      <section className="test-section">
        <h3>타입별 / 성급별</h3>
        <div className="stat-grid">
          <div>
            <h4>타입</h4>
            {Object.entries(byType).map(([t, n]) => (
              <div key={t}>{t}: {n}명</div>
            ))}
          </div>
          <div>
            <h4>성급</h4>
            {Object.entries(byStar).sort(([a], [b]) => Number(a) - Number(b)).map(([s, n]) => (
              <div key={s}>{s}성: {n}명</div>
            ))}
          </div>
        </div>
      </section>

      <section className="test-section">
        <h3>용병 검색</h3>
        <div className="search-row">
          <input
            className="test-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="id, 이름, 또는 code 입력 (예: gunther, 군터, 1347)"
          />
          <button className="test-btn" onClick={handleSearch}>검색</button>
        </div>
        {result && (
          <pre className="test-output">{result}</pre>
        )}
      </section>
    </div>
  )
}
