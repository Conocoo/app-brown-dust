// 스킬 도감 — 8,923개 스킬 검색 + 상세

import { useState } from 'react'
import { getAllSkills, getSkillByCode } from '../data/skills'
import { getBuffByCode } from '../data/buffs'
import { getRepeatCount } from '../logic/skill'
import type { SkillTemplate } from '../types/skill'

const TIMING_LABELS: Record<string, string> = {
  before_attack: '공격 전',
  after_attack: '공격 후',
  passive: '패시브',
  attack: '공격',
}

const TYPE_LABELS: Record<string, string> = {
  attack: '공격', support: '지원',
}

export default function SkillDex() {
  const skills = getAllSkills()
  const [query, setQuery] = useState('')
  const [selectedCode, setSelectedCode] = useState(skills[0]?.code ?? 0)

  const filtered = skills.filter(s => {
    if (!query) return true
    return s.nameKr.includes(query) || s.nameEn.toLowerCase().includes(query.toLowerCase()) || String(s.code).includes(query)
  }).slice(0, 200) // 성능: 최대 200개 표시

  const skill = getSkillByCode(selectedCode)

  return (
    <div style={{ display: 'flex', gap: '1rem', height: '100%' }}>
      {/* 좌측: 스킬 목록 */}
      <div style={{ width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <input
          placeholder="스킬 검색 (이름/코드)"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            fontSize: '0.8rem', padding: '0.3rem 0.5rem',
            background: '#0a1628', border: '1px solid #1a2a4a', borderRadius: '4px', color: '#ddd',
          }}
        />
        <div style={{ fontSize: '0.7rem', color: '#666' }}>
          {filtered.length}개 표시 / 전체 {skills.length}개
        </div>
        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {filtered.map(s => (
            <button key={s.code} onClick={() => setSelectedCode(s.code)}
              style={{
                textAlign: 'left',
                background: selectedCode === s.code ? '#e94560' : 'transparent',
                border: '1px solid #1a2a4a', borderRadius: '4px',
                color: '#ddd', padding: '0.3rem 0.5rem', cursor: 'pointer', fontSize: '0.75rem',
              }}
            >
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {s.nameKr}
              </div>
              <div style={{ fontSize: '0.6rem', color: '#666' }}>
                #{s.code} · {TIMING_LABELS[s.timing] ?? s.timing}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 우측: 스킬 상세 */}
      {skill && <SkillDetail skill={skill} />}
    </div>
  )
}

function SkillDetail({ skill }: { skill: SkillTemplate }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* 헤더 */}
      <div>
        <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#e0e0e0' }}>
          {skill.nameKr}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.2rem' }}>
          {skill.nameEn} · #{skill.code}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <Tag color="#7ec8e3">{TYPE_LABELS[skill.type] ?? skill.type}</Tag>
          <Tag color="#f5a623">{TIMING_LABELS[skill.timing] ?? skill.timing}</Tag>
        </div>
      </div>

      {/* 기본 정보 */}
      <Section title="기본 정보">
        <Grid items={[
          ['쿨타임', skill.coolTimeCount === 0 ? '매 턴 발동' : `${skill.coolTimeCount}턴`],
          ['반복 횟수', `${getRepeatCount(skill.repeatCount)}회`],
          ['범위 패턴', `${skill.rangePattern} (${skill.rangePatternRaw})`],
          ['타겟 방식', `${skill.searchType} (${skill.searchTypeRaw})`],
          ['범위 크기', String(skill.rangeSize)],
        ]} />
      </Section>

      {/* 연결 버프 */}
      {skill.buffs.length > 0 && (
        <Section title={`연결 버프 (${skill.buffs.length}개)`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {skill.buffs.map((b, i) => {
              const buff = getBuffByCode(b.buffCode)
              if (!buff) return (
                <div key={i} style={{ background: '#0f1e3a', borderRadius: '6px', padding: '0.5rem', color: '#666', fontSize: '0.75rem' }}>
                  [알 수 없는 버프 #{b.buffCode}]
                </div>
              )
              const tooltip = buff.tooltipKr
                ? buff.tooltipKr.replace(/\[[^\]]+\]/g, '').trim()
                : ''
              const turnLabel = buff.turn === 1000 ? '영구' : buff.turn === 0 ? '즉시' : `${buff.turn}턴`
              return (
                <div key={i} style={{ background: '#0f1e3a', borderRadius: '6px', padding: '0.5rem 0.75rem', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: tooltip ? '0.3rem' : 0 }}>
                    <span style={{ color: '#aaa' }}>#{buff.code} {buff.nameKr}</span>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ color: buff.category === 'buff' ? '#7ec8e3' : '#e94560', fontWeight: 600 }}>
                        {buff.category === 'buff' ? '버프' : '디버프'}
                      </span>
                      <span style={{ color: '#666' }}>{turnLabel}</span>
                      {buff.magicValue1 !== 0 && (
                        <span style={{ color: '#f5a623' }}>{buff.magicValue1}</span>
                      )}
                    </div>
                  </div>
                  {tooltip && (
                    <div style={{ color: '#888', lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>
                      {tooltip.replace(/\\n/g, '\n')}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Section>
      )}
    </div>
  )
}

function Tag({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span style={{
      background: color, color: '#000', fontSize: '0.75rem', fontWeight: 700,
      padding: '0.15rem 0.5rem', borderRadius: '4px',
    }}>
      {children}
    </span>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ background: '#141e30', borderRadius: '8px', padding: '0.75rem' }}>
      <h3 style={{ color: '#aaa', fontSize: '0.85rem', margin: '0 0 0.5rem 0' }}>{title}</h3>
      {children}
    </section>
  )
}

function Grid({ items }: { items: [string, string][] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
      {items.map(([label, value]) => (
        <div key={label} style={{
          background: '#0f1e3a', borderRadius: '6px', padding: '0.4rem 0.75rem',
          display: 'flex', justifyContent: 'space-between',
        }}>
          <span style={{ color: '#888', fontSize: '0.75rem' }}>{label}</span>
          <span style={{ color: '#e0e0e0', fontSize: '0.8rem' }}>{value}</span>
        </div>
      ))}
    </div>
  )
}
