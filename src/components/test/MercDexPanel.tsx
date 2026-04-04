// 용병 도감 패널 — 초상화 + 스탯 + 스킬 통합 뷰

import { useState } from 'react'
import { getAllMercenaries, getMercenaryById } from '../../data/mercenaries'
import { getSkillByCode } from '../../data/skills'
import { calcStatsAtLevel, maxStats } from '../../logic/stat'
import { getRepeatCount } from '../../logic/skill'

const TYPE_LABELS: Record<string, string> = {
  attacker: '공격형', defender: '방어형', mage: '마법형', support: '지원형',
}
const TYPE_COLORS: Record<string, string> = {
  attacker: '#e94560', defender: '#4caf50', mage: '#7ec8e3', support: '#f5a623',
}

const STAT_ROWS = [
  ['ATK',       (s: ReturnType<typeof maxStats>) => s.atk.toLocaleString()],
  ['HP',        (s: ReturnType<typeof maxStats>) => s.hp.toLocaleString()],
  ['DEF',       (s: ReturnType<typeof maxStats>) => `${s.def}%`],
  ['치명타율',  (s: ReturnType<typeof maxStats>) => `${s.critRate}%`],
  ['치명타피해',(s: ReturnType<typeof maxStats>) => `${s.critDamage}%`],
  ['회피',      (s: ReturnType<typeof maxStats>) => `${s.agility}%`],
  ['관통',      (s: ReturnType<typeof maxStats>) => `${s.piercing}%`],
  ['인내',      (s: ReturnType<typeof maxStats>) => `${s.patience}%`],
  ['지원력',    (s: ReturnType<typeof maxStats>) => s.supportPower > 0 ? s.supportPower.toLocaleString() : '—'],
] as const

export default function MercDexPanel() {
  const mercs = getAllMercenaries()
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [mercId, setMercId] = useState(mercs[0]?.id ?? '')
  const [level, setLevel] = useState(115)
  const [imgError, setImgError] = useState(false)

  const filtered = mercs.filter(m => {
    if (typeFilter && m.type !== typeFilter) return false
    if (query && !m.name.includes(query)) return false
    return true
  })

  const merc = getMercenaryById(mercId) ?? mercs[0]
  const maxL = merc?.maxLevel ?? 115
  const stats = merc ? calcStatsAtLevel(merc, Math.min(level, maxL)) : null
  const skill = merc ? getSkillByCode(merc.skillCode) : undefined

  function selectMerc(id: string) {
    setMercId(id)
    setImgError(false)
    setLevel(115)
  }

  return (
    <div style={{ display: 'flex', gap: '1rem', height: '100%' }}>
      {/* ── 좌측: 용병 목록 ── */}
      <div style={{
        width: '200px', flexShrink: 0,
        display: 'flex', flexDirection: 'column', gap: '0.5rem',
      }}>
        <input
          className="test-input"
          placeholder="이름 검색"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem' }}
        />
        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
          {['', 'attacker', 'defender', 'mage', 'support'].map(t => (
            <button key={t} className="test-btn"
              onClick={() => setTypeFilter(t)}
              style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem', background: typeFilter === t ? '#e94560' : '#2a2a4a' }}
            >
              {t === '' ? '전체' : TYPE_LABELS[t]}
            </button>
          ))}
        </div>
        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {filtered.map(m => (
            <button key={m.id} onClick={() => selectMerc(m.id)}
              style={{
                textAlign: 'left', background: mercId === m.id ? '#e94560' : 'transparent',
                border: '1px solid #1a2a4a', borderRadius: '4px',
                color: '#ddd', padding: '0.3rem 0.5rem', cursor: 'pointer',
                fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
              }}
            >
              <span>{m.emoji}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {m.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 우측: 용병 상세 ── */}
      {merc && stats && (
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* 헤더: 이미지 + 기본 정보 */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            {/* 초상화 */}
            <div style={{
              width: '120px', height: '120px', flexShrink: 0,
              background: '#0f1e3a', borderRadius: '8px',
              border: `2px solid ${TYPE_COLORS[merc.type] ?? '#333'}`,
              overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {!imgError ? (
                <img
                  src={`/images/portraits/char${merc.imageId}icon.png`}
                  alt={merc.name}
                  onError={() => setImgError(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ fontSize: '3rem' }}>{merc.emoji}</span>
              )}
            </div>

            {/* 이름 / 타입 / 성급 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#e0e0e0' }}>
                {merc.name}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{
                  background: TYPE_COLORS[merc.type] ?? '#333',
                  color: '#000', fontSize: '0.75rem', fontWeight: 700,
                  padding: '0.15rem 0.5rem', borderRadius: '4px',
                }}>
                  {TYPE_LABELS[merc.type] ?? merc.type}
                </span>
                <span style={{ color: '#f5a623', fontSize: '0.85rem' }}>
                  {'★'.repeat(merc.star)}
                </span>
              </div>
              <div style={{ color: '#666', fontSize: '0.75rem' }}>
                ID: {merc.id} | 코드: {merc.code}
              </div>
              {/* 레벨 선택 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.3rem' }}>
                <span style={{ color: '#aaa', fontSize: '0.8rem' }}>레벨</span>
                <input
                  type="number" min={1} max={maxL} value={level}
                  onChange={e => setLevel(Math.min(maxL, Math.max(1, Number(e.target.value))))}
                  className="test-input"
                  style={{ width: '70px', fontSize: '0.85rem', padding: '0.2rem 0.5rem' }}
                />
                <span style={{ color: '#555', fontSize: '0.75rem' }}>/ 최대 {maxL}</span>
              </div>
            </div>
          </div>

          {/* 스탯 */}
          <section className="test-section">
            <h3>스탯 (레벨 {level})</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
              {STAT_ROWS.map(([label, fn]) => (
                <div key={label} style={{
                  background: '#0f1e3a', borderRadius: '6px', padding: '0.5rem 0.75rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ color: '#888', fontSize: '0.75rem' }}>{label}</span>
                  <span style={{ color: '#e0e0e0', fontSize: '0.9rem', fontWeight: 600 }}>
                    {(fn as (s: typeof stats) => string)(stats)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 스킬 */}
          <section className="test-section">
            <h3>스킬</h3>
            {!skill ? (
              <p style={{ color: '#666', fontSize: '0.85rem' }}>스킬 없음</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#e0e0e0' }}>
                  {skill.nameKr}
                  <span style={{ marginLeft: '0.75rem', fontSize: '0.75rem', color: '#888' }}>
                    ({skill.type} / {skill.timing})
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
                  {[
                    ['쿨타임', skill.coolTimeCount === 0 ? '매 턴 발동' : `${skill.coolTimeCount}턴`],
                    ['반복 횟수', `${getRepeatCount(skill.repeatCount)}회`],
                    ['범위 패턴', `${skill.rangePattern} (${skill.rangePatternRaw})`],
                    ['타겟 방식', `${skill.searchType} (${skill.searchTypeRaw})`],
                    ['범위 크기', String(skill.rangeSize)],
                    ['연결 버프', `${skill.buffs.length}개`],
                  ].map(([label, value]) => (
                    <div key={label} style={{
                      background: '#0f1e3a', borderRadius: '6px', padding: '0.4rem 0.75rem',
                      display: 'flex', justifyContent: 'space-between',
                    }}>
                      <span style={{ color: '#888', fontSize: '0.75rem' }}>{label}</span>
                      <span style={{ color: '#e0e0e0', fontSize: '0.8rem' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
