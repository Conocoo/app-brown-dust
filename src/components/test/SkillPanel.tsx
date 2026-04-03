// STEP 8 테스트 패널: 스킬 실행 검증
import { useState } from 'react'
import { getAllMercenaries, getMercenaryById } from '../../data/mercenaries'
import { getSkillByCode } from '../../data/skills'
import {
  isTurnSkillUse, plusCoolTimeCount, onSkillUsed, isCastingState, getRepeatCount,
} from '../../logic/skill'

interface SimChar {
  coolTimeCounters: Record<number, number>
}

export default function SkillPanel() {
  const [mercId, setMercId] = useState('')
  const [simChar, setSimChar] = useState<SimChar>({ coolTimeCounters: {} })
  const [turnLog, setTurnLog] = useState<string[]>([])
  const [turnCount, setTurnCount] = useState(0)

  const mercs = getAllMercenaries()
  const merc = getMercenaryById(mercId) ?? mercs[0]
  const skill = merc ? getSkillByCode(merc.skillCode) : undefined

  const skillCode = skill?.code ?? 0
  const coolTimeCount = skill?.coolTimeCount ?? 0
  const repeatCount = skill ? getRepeatCount(skill.repeatCount) : 1

  const counter = simChar.coolTimeCounters[skillCode] ?? 0
  const canUse = skill ? isTurnSkillUse(simChar as never, skillCode, coolTimeCount) : false
  const isCasting = skill ? isCastingState(simChar as never, skillCode, coolTimeCount) : false

  function advanceTurn() {
    const newTurn = turnCount + 1
    const newChar = { coolTimeCounters: { ...simChar.coolTimeCounters } }
    const entries: string[] = [`--- 턴 ${newTurn} ---`]

    if (!skill) {
      entries.push('스킬 없음')
    } else if (!isTurnSkillUse(newChar as never, skillCode, coolTimeCount)) {
      // 쿨타임 대기
      plusCoolTimeCount(newChar as never, skillCode)
      const newCounter = newChar.coolTimeCounters[skillCode] ?? 0
      entries.push(`캐스팅 중 (${newCounter}/${coolTimeCount}) — 공격 없음`)
    } else {
      // 스킬 발동
      entries.push(`스킬 발동! (쿨타임: ${coolTimeCount}) → ${repeatCount}회 공격`)
      onSkillUsed(newChar as never, skillCode)
      entries.push(`쿨타임 리셋 → ${newChar.coolTimeCounters[skillCode] ?? 0}/${coolTimeCount}`)
    }

    setSimChar(newChar)
    setTurnCount(newTurn)
    setTurnLog(prev => [...prev, ...entries])
  }

  function resetSim() {
    setSimChar({ coolTimeCounters: {} })
    setTurnLog([])
    setTurnCount(0)
  }

  return (
    <div className="test-panel">
      <h2>스킬 실행 검증</h2>

      <section className="test-section">
        <h3>용병 선택</h3>
        <select
          className="test-input"
          value={mercId}
          onChange={e => { setMercId(e.target.value); resetSim() }}
        >
          <option value="">-- 용병 선택 --</option>
          {mercs.map(m => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.type})
            </option>
          ))}
        </select>
      </section>

      {skill && (
        <section className="test-section">
          <h3>스킬 정보</h3>
          <table className="stat-table">
            <tbody>
              <tr><td>스킬 코드</td><td>{skill.code}</td></tr>
              <tr><td>이름</td><td>{skill.nameKr}</td></tr>
              <tr><td>타입</td><td>{skill.type}</td></tr>
              <tr><td>타이밍</td><td>{skill.timing}</td></tr>
              <tr><td>rangePattern</td><td>{skill.rangePattern} (raw: {skill.rangePatternRaw})</td></tr>
              <tr><td>searchType</td><td>{skill.searchType} (raw: {skill.searchTypeRaw})</td></tr>
              <tr><td>rangeSize</td><td>{skill.rangeSize}</td></tr>
              <tr><td>coolTimeCount</td><td>{coolTimeCount === 0 ? '없음 (매 턴 발동)' : coolTimeCount}</td></tr>
              <tr><td>repeatCount</td><td>{repeatCount}회</td></tr>
            </tbody>
          </table>
        </section>
      )}

      {skill && (
        <section className="test-section">
          <h3>쿨타임 시뮬레이션</h3>

          <div style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button className="test-btn" onClick={advanceTurn}>턴 진행</button>
            <button className="test-btn" onClick={resetSim}>리셋</button>
            <span style={{ color: '#aaa', fontSize: '0.85rem' }}>
              현재 카운터: {counter}/{coolTimeCount || '∞'}
            </span>
          </div>

          <div style={{ marginBottom: '0.5rem', display: 'flex', gap: '1rem' }}>
            <span style={{ color: canUse ? '#4caf50' : '#e94560' }}>
              스킬 발동 가능: {canUse ? '✅ 예' : '❌ 아니오'}
            </span>
            <span style={{ color: isCasting ? '#f5a623' : '#555' }}>
              캐스팅 중: {isCasting ? '✅' : '-'}
            </span>
          </div>

          {turnLog.length > 0 && (
            <pre className="test-output" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {turnLog.join('\n')}
            </pre>
          )}
        </section>
      )}

      <section className="test-section">
        <h3>쿨타임 규칙</h3>
        <pre className="test-output" style={{ fontSize: '0.75rem' }}>
{`coolTimeCount = 0 → 매 턴 스킬 발동 (마법형이 아닌 대부분)
coolTimeCount = N → N턴 충전 후 발동, 이후 리셋

IsTurnSkillUse(): counter >= coolTimeCount → 발동 가능
PlusCoolTimeCount(): counter += 1 (매 쿨타임 대기 턴)
InitCoolTime(): counter = 0 (스킬 발동 후 리셋)

repeatCount = N → 같은 턴 내 N회 반복 공격 (타겟 재선택 없음)`}
        </pre>
      </section>
    </div>
  )
}
