// STEP 4 테스트 패널: 데미지 계산 검증
import { useState } from 'react'
import { calcDamage, calcGrazeDebuffTurn } from '../../logic/damage'
import type { AttackerStats, DefenderStats } from '../../logic/damage'

interface StatInput {
  atk: number
  critRate: number
  critDamage: number
  piercing: number
  fixedDamageRate: number
  def: number
  agility: number
  critResist: number
}

const DEFAULT_INPUT: StatInput = {
  atk: 1000,
  critRate: 15,
  critDamage: 200,
  piercing: 0,
  fixedDamageRate: 0,
  def: 30,
  agility: 0,
  critResist: 0,
}

type NumField = keyof StatInput

export default function DamagePanel() {
  const [input, setInput] = useState<StatInput>(DEFAULT_INPUT)

  function set(field: NumField, value: number) {
    setInput(prev => ({ ...prev, [field]: value }))
  }

  function numInput(field: NumField, label: string, min = 0, max = 9999, step = 1) {
    return (
      <div className="search-row" style={{ marginBottom: '0.4rem' }}>
        <label style={{ color: '#aaa', width: '160px', display: 'inline-block' }}>{label}</label>
        <input
          className="test-input"
          type="number"
          min={min}
          max={max}
          step={step}
          value={input[field]}
          onChange={e => set(field, Number(e.target.value))}
          style={{ width: '90px' }}
        />
      </div>
    )
  }

  const attacker: AttackerStats = {
    atk: input.atk,
    critRate: input.critRate,
    critDamage: input.critDamage,
    piercing: input.piercing,
    fixedDamageRate: input.fixedDamageRate / 100,
  }
  const defender: DefenderStats = {
    def: input.def,
    hp: 10000,
    agility: input.agility,
    critResist: input.critResist,
  }

  const normal    = calcDamage(attacker, defender, { forceCrit: false, forceDodge: false })
  const crit      = calcDamage(attacker, defender, { forceCrit: true,  forceDodge: false })
  const graze     = calcDamage(attacker, defender, { forceCrit: false, forceDodge: true  })
  const critGraze = calcDamage(attacker, defender, { forceCrit: true,  forceDodge: true  })

  function row(label: string, res: ReturnType<typeof calcDamage>) {
    return (
      <tr key={label}>
        <td>{label}</td>
        <td>{res.isCritical ? '✅' : '-'}</td>
        <td>{res.isDodge ? '✅' : '-'}</td>
        <td>{res.variableDamage}</td>
        <td>{res.fixedDamage > 0 ? res.fixedDamage : '-'}</td>
        <td><strong>{res.totalDamage}</strong></td>
        <td>{res.debuffTurnReduced ? `x${1 - 0.5} (50% 감소)` : '-'}</td>
      </tr>
    )
  }

  // 디버프 턴 예시
  const exampleTurns = [1, 2, 3, 4, 5]

  return (
    <div className="test-panel">
      <h2>데미지 계산 검증</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <section className="test-section">
          <h3>공격자 스탯</h3>
          {numInput('atk', 'ATK', 0, 99999)}
          {numInput('critRate', '치명타 확률 %', 0, 100)}
          {numInput('critDamage', '치명타 피해 %', 0, 1000)}
          {numInput('piercing', '관통 %', 0, 100)}
          {numInput('fixedDamageRate', '고정 데미지 비율 %', 0, 100)}
        </section>

        <section className="test-section">
          <h3>방어자 스탯</h3>
          {numInput('def', '방어율 %', 0, 100)}
          {numInput('agility', '스침 확률 %', 0, 100)}
          {numInput('critResist', '치명타 저항 %', 0, 100)}
          <p style={{ color: '#555', fontSize: '0.8rem', marginTop: '0.5rem' }}>
            * 방어율 상한 70% (protectedRate 최솟값 0.3)
          </p>
        </section>
      </div>

      <section className="test-section">
        <h3>시나리오별 데미지</h3>
        <table className="stat-table">
          <thead>
            <tr>
              <th>시나리오</th>
              <th>치명타</th>
              <th>스침</th>
              <th>가변</th>
              <th>고정</th>
              <th>합계</th>
              <th>디버프 턴</th>
            </tr>
          </thead>
          <tbody>
            {row('일반', normal)}
            {row('치명타', crit)}
            {row('스침', graze)}
            {row('치명타+스침', critGraze)}
          </tbody>
        </table>
      </section>

      <section className="test-section">
        <h3>스침 디버프 턴 감소 (50%)</h3>
        <table className="stat-table">
          <thead>
            <tr>
              <th>원래 턴</th>
              <th>스침 후 잔여 턴</th>
              <th>감소량</th>
            </tr>
          </thead>
          <tbody>
            {exampleTurns.map(t => {
              const after = calcGrazeDebuffTurn(t)
              return (
                <tr key={t}>
                  <td>{t}</td>
                  <td>{after}</td>
                  <td style={{ color: '#e94560' }}>-{t - after}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '0.5rem' }}>
          * 공식: reduced = floor(maxTurn × 0.5), 잔여 = maxTurn - reduced
        </p>
      </section>

      <section className="test-section">
        <h3>공식 참조</h3>
        <pre className="test-output" style={{ fontSize: '0.75rem' }}>
{`[치명타] roll = [0, 10000), 치명타 발동 if critRate/100 > roll/10000
  효과: damage += damage × max(0, critDmg/100 × (1 - critResist/100))

[스침]  roll = [0, 10000), 스침 발동 if agility/100 > roll/10000
  효과: variable -= variable × 0.35  (×0.65)
  부가: 디버프 턴 50% 감소 (스침 발동 시만)

[방어]  protectedRate = max(0.3, 1 - def/100)
  관통 적용: effectiveDef = protectedRate × (1 - piercing/100)
  final_variable = (variable - variable × effectiveDef) × reciveDamageRate

[고정]  fixed = base × fixedDamageRate → 방어/스침 무시`}
        </pre>
      </section>
    </div>
  )
}
