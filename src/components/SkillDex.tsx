import { useState } from 'react'
import type { Skill, SkillTiming } from '../types/skill'
import { getAllSkills } from '../data/skills'

const TIMING_LABEL: Record<SkillTiming, string> = {
  before_attack: '공격 전',
  after_attack: '공격 후',
  passive: '패시브',
}

const TARGET_LABEL: Record<string, string> = {
  enemy_front: '적 전열',
  enemy_second: '적 2열',
  enemy_back: '적 후열',
  enemy_random: '적 랜덤',
  next_ally: '인접 아군',
  self: '자신',
}

const TIMING_FILTERS: { value: SkillTiming | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'before_attack', label: '공격 전' },
  { value: 'after_attack', label: '공격 후' },
  { value: 'passive', label: '패시브' },
]

function effectDetailLines(skill: Skill): string[] {
  return skill.effects.map((e, i) => {
    const parts: string[] = [`효과${skill.effects.length > 1 ? ` ${i + 1}` : ''}: ${e.type}`]
    if (e.atkScaling) parts.push(`ATK×${e.value}%`)
    else if (e.spScaling) parts.push(`지원력×${e.value}%`)
    else if (e.value) parts.push(`수치 ${e.value}%`)
    if (e.duration) parts.push(`${e.duration}턴 지속`)
    if (e.buffType) parts.push(`버프: ${e.buffType}`)
    if (e.debuffClass) parts.push(`디버프: ${e.debuffClass}`)
    if (e.dmgTakenUp) parts.push(`받는 피해 +${e.dmgTakenUp}%`)
    if (e.ignoreImmunity) parts.push('면역 관통')
    if (e.triggerSkill) parts.push(`연쇄: ${e.triggerSkill}`)
    if (e.linkedBuffId) parts.push(`연결: ${e.linkedBuffId}`)
    return parts.join(' / ')
  })
}

interface Props {
  onBack: () => void
}

export default function SkillDex({ onBack }: Props) {
  const allSkills = getAllSkills()
  const [filter, setFilter] = useState<SkillTiming | 'all'>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = filter === 'all'
    ? allSkills
    : allSkills.filter((s) => s.timing === filter)

  const selected = selectedId
    ? allSkills.find((s) => s.id === selectedId) ?? null
    : null

  return (
    <div className="dex">
      <div className="dex-header">
        <button className="btn-back" onClick={onBack}>← 홈</button>
        <h2>스킬 도감</h2>
        <span className="dex-count">{allSkills.length}개</span>
      </div>

      <div className="dex-filters">
        {TIMING_FILTERS.map((f) => (
          <button
            key={f.value}
            className={`dex-filter-btn ${filter === f.value ? 'dex-filter-active' : ''}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="dex-layout">
        <div className="dex-list">
          {filtered.map((skill) => (
            <div
              key={skill.id}
              className={`dex-card dex-card-skill ${selectedId === skill.id ? 'dex-card-selected' : ''}`}
              onClick={() => setSelectedId(skill.id)}
            >
              <div className={`dex-card-timing ci-skill-timing-${skill.timing}`}>
                {TIMING_LABEL[skill.timing]}
              </div>
              <div className="dex-card-info">
                <span className="dex-card-name">{skill.name}</span>
                <span className="dex-card-sub">{TARGET_LABEL[skill.target] ?? skill.target}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="dex-detail">
          {selected ? (
            <SkillDetail skill={selected} />
          ) : (
            <div className="dex-detail-empty">스킬을 선택하세요</div>
          )}
        </div>
      </div>
    </div>
  )
}

function SkillDetail({ skill }: { skill: Skill }) {
  const lines = effectDetailLines(skill)

  return (
    <div className="dex-skill-detail">
      <div className="dex-skill-detail-header">
        <h3>{skill.name}</h3>
        <span className={`ci-skill-timing-badge ci-skill-timing-${skill.timing}`}>
          {TIMING_LABEL[skill.timing]}
        </span>
      </div>

      <div className="dex-skill-detail-meta">
        <span>ID: <code>{skill.id}</code></span>
        <span>대상: {TARGET_LABEL[skill.target] ?? skill.target}</span>
      </div>

      <div className="dex-skill-detail-effects">
        <h4>효과</h4>
        {lines.map((line, i) => (
          <div key={i} className="dex-effect-line">{line}</div>
        ))}
      </div>

      <div className="dex-skill-detail-raw">
        <h4>원본 데이터</h4>
        <pre>{JSON.stringify(skill.effects, null, 2)}</pre>
      </div>
    </div>
  )
}
