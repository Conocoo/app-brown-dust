// STEP 3 테스트 패널: 스탯 계산 검증
import { useState } from 'react'
import { getAllMercenaries, getMercenaryById } from '../../data/mercenaries'
import { getSkillByCode } from '../../data/skills'
import { calcStatsAtLevel, maxStats, levelMultiply } from '../../logic/stat'
import { applyRunes } from '../../logic/rune'
import { getRepeatCount } from '../../logic/skill'
import type { RuneSlots } from '../../types/rune'

const EMPTY_RUNES: RuneSlots = [null, null, null]

export default function StatPanel() {
  const [mercId, setMercId] = useState('')
  const [level, setLevel] = useState(115)

  const mercs = getAllMercenaries()
  const merc = getMercenaryById(mercId) ?? mercs[0]

  const base = calcStatsAtLevel(merc, level)
  const withRunes = applyRunes(base, EMPTY_RUNES)
  const maxL = merc.maxLevel ?? 115
  const lm = levelMultiply(level)
  const skill = getSkillByCode(merc.skillCode)

  return (
    <div className="test-panel">
      <h2>스탯 계산 검증</h2>

      <section className="test-section">
        <h3>용병 선택</h3>
        <div className="search-row">
          <select
            className="test-input"
            value={mercId}
            onChange={(e) => setMercId(e.target.value)}
          >
            <option value="">-- 용병 선택 --</option>
            {mercs.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.type}, {m.star}성)
              </option>
            ))}
          </select>
        </div>

        <div className="search-row">
          <label style={{ color: '#aaa', marginRight: '0.5rem' }}>레벨:</label>
          <input
            className="test-input"
            type="number"
            min={1}
            max={maxL}
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            style={{ width: '80px' }}
          />
          <span style={{ color: '#666', marginLeft: '0.5rem' }}>
            / 최대 {maxL} (levelMultiply = {lm})
          </span>
        </div>
      </section>

      <section className="test-section">
        <h3>스탯 결과</h3>
        <table className="stat-table">
          <thead>
            <tr>
              <th>스탯</th>
              <th>레벨 {level} (공식)</th>
              <th>최대 레벨 (JSON)</th>
              <th>차이</th>
            </tr>
          </thead>
          <tbody>
            {([
              ['ATK', base.atk, maxStats(merc).atk],
              ['HP', base.hp, maxStats(merc).hp],
              ['SP', base.supportPower, maxStats(merc).supportPower],
              ['DEF %', base.def, maxStats(merc).def],
              ['CritRate %', base.critRate, maxStats(merc).critRate],
              ['CritDmg %', base.critDamage, maxStats(merc).critDamage],
              ['Agility %', base.agility, maxStats(merc).agility],
              ['Piercing %', base.piercing, maxStats(merc).piercing],
              ['Patience %', base.patience, maxStats(merc).patience],
            ] as [string, number, number][]).map(([label, calc, json]) => (
              <tr key={label}>
                <td>{label}</td>
                <td>{Math.round(calc)}</td>
                <td>{json}</td>
                <td style={{ color: Math.abs(calc - json) > 5 ? '#e94560' : '#888' }}>
                  {level === maxL
                    ? (Math.round(calc - json) === 0 ? '✅' : String(Math.round(calc - json)))
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '0.5rem' }}>
          * 레벨 성장 공식: raw + raw × growthRate × levelMultiply(level)<br />
          * 비율 스탯(DEF, CritRate 등)은 레벨 성장 없음 (장비/버프로만 변동)
        </p>
      </section>

      <section className="test-section">
        <h3>스킬 정보</h3>
        {!skill ? (
          <p style={{ color: '#666', fontSize: '0.85rem' }}>스킬 없음</p>
        ) : (
          <table className="stat-table">
            <tbody>
              <tr><td>이름</td><td>{skill.nameKr}</td></tr>
              <tr><td>타입</td><td>{skill.type}</td></tr>
              <tr><td>타이밍</td><td>{skill.timing}</td></tr>
              <tr>
                <td>쿨타임</td>
                <td>{skill.coolTimeCount === 0 ? '매 턴 발동' : `${skill.coolTimeCount}턴`}</td>
              </tr>
              <tr><td>반복 횟수</td><td>{getRepeatCount(skill.repeatCount)}회</td></tr>
              <tr><td>범위 패턴</td><td>{skill.rangePattern} (raw: {skill.rangePatternRaw})</td></tr>
              <tr><td>타겟 방식</td><td>{skill.searchType} (raw: {skill.searchTypeRaw})</td></tr>
              <tr><td>범위 크기</td><td>{skill.rangeSize}</td></tr>
              <tr><td>연결 버프</td><td>{skill.buffs.length}개</td></tr>
            </tbody>
          </table>
        )}
      </section>

      <section className="test-section">
        <h3>룬 적용 미리보기 (슬롯 없음)</h3>
        <pre className="test-output">
          {JSON.stringify(withRunes, null, 2)}
        </pre>
      </section>
    </div>
  )
}
