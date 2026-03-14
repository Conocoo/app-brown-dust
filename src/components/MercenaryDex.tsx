import { useState } from 'react'
import type { MercenaryTemplate } from '../types/mercenary'
import type { CharacterType } from '../types/game'
import type { Skill } from '../types/skill'
import { getAllMercenaries } from '../data/mercenaries'
import { resolveSkills } from '../data/skills'

const TYPE_LABEL: Record<string, string> = {
  attacker: '공격형',
  defender: '방어형',
  support: '지원형',
  mage: '마법형',
}

const TYPE_ICON: Record<string, string> = {
  attacker: '⚔️',
  defender: '🛡️',
  support: '💚',
  mage: '🔮',
}

const TIMING_LABEL: Record<string, string> = {
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

const RANGE_LABEL: Record<string, string> = {
  single: '단일',
  horizontal: '가로',
  vertical: '세로',
  cross: '십자',
  x_shape: 'X자',
  area_n: '범위',
  diamond: '마름모',
  small_cross: '소십자',
  back_n: '후방',
  front_n: '전방',
}

const TYPE_FILTERS: { value: CharacterType | 'all'; label: string; icon?: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'attacker', label: '공격', icon: '⚔️' },
  { value: 'defender', label: '방어', icon: '🛡️' },
  { value: 'mage', label: '마법', icon: '🔮' },
  { value: 'support', label: '지원', icon: '💚' },
]

const STAR_FILTERS = [
  { value: 0 as number, label: '전체' },
  { value: 3, label: '★3' },
  { value: 4, label: '★4' },
  { value: 5, label: '★5' },
]

function skillEffectDesc(skill: Skill): string {
  return skill.effects.map((e) => {
    const parts: string[] = []
    if (e.atkScaling) parts.push(`ATK×${e.value}%`)
    else if (e.spScaling) parts.push(`지원력×${e.value}%`)
    else if (e.value) parts.push(`${e.value}%`)
    if (e.duration) parts.push(`${e.duration}턴`)
    if (e.dmgTakenUp) parts.push(`받피+${e.dmgTakenUp}%`)
    if (e.type === 'on_kill_heal_percent') parts.push(`처치 시 HP${e.value}% 회복`)
    if (e.buffType === 'shield') parts.push('보호막')
    if (e.debuffClass) parts.push(`[${e.debuffClass}]`)
    if (e.ignoreImmunity) parts.push('(면역관통)')
    return parts.join(' ')
  }).join(', ')
}

interface Props {
  onBack: () => void
}

export default function MercenaryDex({ onBack }: Props) {
  const mercenaries = getAllMercenaries()
  const [typeFilter, setTypeFilter] = useState<CharacterType | 'all'>('all')
  const [starFilter, setStarFilter] = useState<number>(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = mercenaries.filter((m) => {
    if (typeFilter !== 'all' && m.type !== typeFilter) return false
    if (starFilter !== 0 && m.star !== starFilter) return false
    return true
  })

  const selected = selectedId
    ? mercenaries.find((m) => m.id === selectedId) ?? null
    : null

  const selectedSkills = selected ? resolveSkills(selected.skills) : []

  return (
    <div className="dex">
      <div className="dex-header">
        <button className="btn-back" onClick={onBack}>←</button>
        <h2>용병 도감</h2>
        <span className="dex-count">{filtered.length}명</span>
      </div>

      <div className="dex-filters">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.value}
            className={`dex-filter-btn ${typeFilter === f.value ? 'dex-filter-active' : ''}`}
            onClick={() => setTypeFilter(f.value)}
          >
            {f.icon && <span className="dex-filter-icon">{f.icon}</span>}
            {f.label}
          </button>
        ))}
      </div>

      <div className="dex-filters dex-filters-star">
        {STAR_FILTERS.map((f) => (
          <button
            key={f.value}
            className={`dex-filter-btn dex-filter-star ${starFilter === f.value ? 'dex-filter-active' : ''}`}
            onClick={() => setStarFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="dex-grid">
        {filtered.map((m) => (
          <div
            key={m.id}
            className={`dex-grid-card ${selectedId === m.id ? 'dex-grid-card-selected' : ''}`}
            onClick={() => setSelectedId(m.id)}
          >
            <div className={`dex-grid-portrait dex-grid-portrait-${m.star}star`}>
              {m.imageId ? (
                <img src={`/images/portraits/char${m.imageId}icon.png`} alt={m.name} />
              ) : (
                <span className="dex-grid-emoji">{m.emoji}</span>
              )}
              <span className="dex-grid-type-icon">{TYPE_ICON[m.type]}</span>
              <div className="dex-grid-stars">
                {'★'.repeat(m.star)}
              </div>
            </div>
            <span className="dex-grid-name">{m.name}</span>
          </div>
        ))}
      </div>

      {selected && (
        <div className="dex-modal-overlay" onClick={() => setSelectedId(null)}>
          <div className="dex-modal" onClick={(e) => e.stopPropagation()}>
            <button className="dex-modal-close" onClick={() => setSelectedId(null)}>✕</button>
            <MercDetail merc={selected} skills={selectedSkills} />
          </div>
        </div>
      )}
    </div>
  )
}

function MercDetail({ merc, skills }: { merc: MercenaryTemplate; skills: Skill[] }) {
  return (
    <div className="dex-merc-detail">
      <div className="dex-merc-header">
        <div className={`dex-merc-portrait dex-grid-portrait-${merc.star}star`}>
          {merc.imageId ? (
            <img src={`/images/portraits/char${merc.imageId}icon.png`} alt={merc.name} />
          ) : (
            <span className="dex-merc-emoji">{merc.emoji}</span>
          )}
        </div>
        <div className="dex-merc-title">
          <h3>{merc.name}</h3>
          <span className={`ci-type-badge ci-type-${merc.type}`}>
            {TYPE_ICON[merc.type]} {'★'.repeat(merc.star)} {TYPE_LABEL[merc.type]}
          </span>
        </div>
      </div>

      <div className="dex-merc-stats">
        <div className="dex-stat-grid">
          <div className="dex-stat-item">
            <span className="dex-stat-label">HP</span>
            <span className="dex-stat-value">{merc.maxHp}</span>
          </div>
          <div className="dex-stat-item">
            <span className="dex-stat-label">{merc.type === 'support' ? '지원력' : 'ATK'}</span>
            <span className="dex-stat-value">
              {merc.type === 'support' ? `${merc.supportPower}%` : merc.atk}
            </span>
          </div>
          <div className="dex-stat-item">
            <span className="dex-stat-label">DEF</span>
            <span className="dex-stat-value">{merc.def}%</span>
          </div>
          <div className="dex-stat-item">
            <span className="dex-stat-label">적중</span>
            <span className="dex-stat-value">{merc.critRate}%</span>
          </div>
          <div className="dex-stat-item">
            <span className="dex-stat-label">치명</span>
            <span className="dex-stat-value">{merc.critDamage}%</span>
          </div>
          <div className="dex-stat-item">
            <span className="dex-stat-label">민첩</span>
            <span className="dex-stat-value">{merc.agility}%</span>
          </div>
        </div>
        <div className="dex-stat-row-bottom">
          <span className="dex-stat-tag">타겟: {TARGET_LABEL[merc.attackTarget ?? 'enemy_front']}</span>
          <span className="dex-stat-tag">범위: {RANGE_LABEL[merc.attackRange ?? 'single']}{merc.rangeSize ? `(${merc.rangeSize})` : ''}</span>
          {merc.selfDestruct && <span className="dex-stat-tag dex-stat-warn">💀 자폭</span>}
        </div>
      </div>

      <div className="dex-merc-skills">
        <h4>스킬</h4>
        {skills.map((skill) => (
          <div key={skill.id} className={`dex-skill-item ci-skill-timing-${skill.timing}`}>
            <div className="dex-skill-header">
              <span className={`dex-skill-timing-badge ci-skill-timing-${skill.timing}`}>
                {TIMING_LABEL[skill.timing]}
              </span>
              <span className="dex-skill-name">{skill.name}</span>
              <span className="dex-skill-target">{TARGET_LABEL[skill.target] ?? skill.target}</span>
            </div>
            <div className="dex-skill-desc">{skillEffectDesc(skill)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
