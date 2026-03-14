import { useState, useMemo } from 'react'
import type { Skill, SkillTiming } from '../types/skill'
import { getAllSkills } from '../data/skills'
import { getAllMercenaries } from '../data/mercenaries'

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

/** 스킬을 카테고리로 분류 */
type SkillCategory = {
  key: string
  label: string
  match: (skill: Skill) => boolean
}

const SKILL_CATEGORIES: SkillCategory[] = [
  { key: 'all', label: '전체', match: () => true },
  { key: 'damage', label: '데미지', match: (s) => s.effects.some((e) => ['damage', 'def_scaling_damage', 'crit_scaling_damage'].includes(e.type)) },
  { key: 'dot', label: 'DoT', match: (s) => s.effects.some((e) => ['burn', 'advanced_burn'].includes(e.type)) },
  { key: 'buff', label: '능력 강화', match: (s) => s.effects.some((e) => ['atk_up', 'crit_up', 'crit_damage_up', 'crit_damage_up_stacking', 'on_kill_atk_up', 'temp_hp'].includes(e.type)) },
  { key: 'debuff', label: '능력 약화', match: (s) => s.effects.some((e) => ['atk_down', 'def_down', 'crit_rate_down', 'crit_damage_down', 'agility_down'].includes(e.type)) },
  { key: 'cc', label: 'CC', match: (s) => s.effects.some((e) => ['stun', 'focus_fire'].includes(e.type)) },
  { key: 'shield', label: '보호막', match: (s) => s.effects.some((e) => e.type === 'shield') },
  { key: 'taunt', label: '도발', match: (s) => s.effects.some((e) => e.type === 'taunt') },
  { key: 'immune', label: '면역', match: (s) => s.effects.some((e) => ['harmful_immune', 'cc_immune', 'dot_immune', 'stat_debuff_immune', 'taunt_immune'].includes(e.type)) },
  { key: 'dispel', label: '해제', match: (s) => s.effects.some((e) => ['dispel', 'buff_block'].includes(e.type)) },
  { key: 'heal', label: '회복', match: (s) => s.effects.some((e) => e.type === 'on_kill_heal_percent') },
]

function effectSummary(skill: Skill): string {
  return skill.effects.map((e) => {
    const parts: string[] = [e.type.replace(/_/g, ' ')]
    if (e.atkScaling) parts.push(`ATK×${e.value}%`)
    else if (e.spScaling) parts.push(`지원력×${e.value}%`)
    else if (e.value) parts.push(`${e.value}%`)
    if (e.duration) parts.push(`${e.duration}턴`)
    return parts.join(' ')
  }).join(' / ')
}

interface Props {
  onBack: () => void
}

export default function SkillDex({ onBack }: Props) {
  const allSkills = getAllSkills()
  const allMercenaries = getAllMercenaries()
  const [category, setCategory] = useState('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  /** 스킬 ID별 사용 용병 수 */
  const usageMap = useMemo(() => {
    const map = new Map<string, string[]>()
    for (const merc of allMercenaries) {
      for (const ref of merc.skills) {
        const list = map.get(ref.skillId) ?? []
        list.push(merc.name)
        map.set(ref.skillId, list)
      }
    }
    return map
  }, [allMercenaries])

  const activeCategory = SKILL_CATEGORIES.find((c) => c.key === category) ?? SKILL_CATEGORIES[0]
  const filtered = allSkills.filter(activeCategory.match)

  const selected = selectedId
    ? allSkills.find((s) => s.id === selectedId) ?? null
    : null

  return (
    <div className="dex">
      <div className="dex-header">
        <button className="btn-back" onClick={onBack}>←</button>
        <h2>스킬 도감</h2>
        <span className="dex-count">{allSkills.length}개</span>
      </div>

      <div className="sdex-layout">
        <div className="sdex-sidebar">
          {SKILL_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              className={`sdex-cat-btn ${category === cat.key ? 'sdex-cat-active' : ''}`}
              onClick={() => { setCategory(cat.key); setSelectedId(null) }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="sdex-list">
          {filtered.map((skill) => {
            const users = usageMap.get(skill.id) ?? []
            return (
              <div
                key={skill.id}
                className={`sdex-card ${selectedId === skill.id ? 'sdex-card-selected' : ''}`}
                onClick={() => setSelectedId(skill.id)}
              >
                <div className={`sdex-card-icon ci-skill-timing-${skill.timing}`}>
                  {TIMING_LABEL[skill.timing].charAt(0)}
                </div>
                <div className="sdex-card-info">
                  <span className="sdex-card-name">{skill.name}</span>
                  <span className="sdex-card-sub">{effectSummary(skill)}</span>
                </div>
                <div className="sdex-card-usage">
                  <span className="sdex-card-usage-label">사용용병</span>
                  <span className="sdex-card-usage-count">{users.length}</span>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="sdex-empty">해당 카테고리의 스킬이 없습니다</div>
          )}
        </div>
      </div>

      {selected && (
        <div className="dex-modal-overlay" onClick={() => setSelectedId(null)}>
          <div className="dex-modal" onClick={(e) => e.stopPropagation()}>
            <button className="dex-modal-close" onClick={() => setSelectedId(null)}>✕</button>
            <SkillDetail skill={selected} users={usageMap.get(selected.id) ?? []} />
          </div>
        </div>
      )}
    </div>
  )
}

function SkillDetail({ skill, users }: { skill: Skill; users: string[] }) {
  return (
    <div className="sdex-detail">
      <div className="sdex-detail-header">
        <div className={`sdex-detail-icon ci-skill-timing-${skill.timing}`}>
          {TIMING_LABEL[skill.timing]}
        </div>
        <div>
          <h3>{skill.name}</h3>
          <span className="sdex-detail-id">{skill.id}</span>
        </div>
      </div>

      <div className="sdex-detail-meta">
        <span className="dex-stat-tag">대상: {TARGET_LABEL[skill.target] ?? skill.target}</span>
        <span className="dex-stat-tag">타이밍: {TIMING_LABEL[skill.timing]}</span>
      </div>

      <div className="sdex-detail-section">
        <h4>효과</h4>
        {skill.effects.map((e, i) => (
          <div key={i} className="sdex-effect-row">
            <span className="sdex-effect-type">{e.type.replace(/_/g, ' ')}</span>
            <div className="sdex-effect-details">
              {e.atkScaling && <span className="sdex-effect-tag">ATK×{e.value}%</span>}
              {e.spScaling && <span className="sdex-effect-tag">지원력×{e.value}%</span>}
              {!e.atkScaling && !e.spScaling && e.value !== 0 && (
                <span className="sdex-effect-tag">{e.value}%</span>
              )}
              {e.duration && <span className="sdex-effect-tag">{e.duration}턴</span>}
              {e.buffType && <span className="sdex-effect-tag buff">{e.buffType}</span>}
              {e.debuffClass && <span className="sdex-effect-tag debuff">{e.debuffClass}</span>}
              {e.dmgTakenUp && <span className="sdex-effect-tag debuff">받피+{e.dmgTakenUp}%</span>}
              {e.ignoreImmunity && <span className="sdex-effect-tag warn">면역관통</span>}
              {e.triggerSkill && <span className="sdex-effect-tag">연쇄: {e.triggerSkill}</span>}
              {e.linkedBuffId && <span className="sdex-effect-tag">연결: {e.linkedBuffId}</span>}
            </div>
          </div>
        ))}
      </div>

      {users.length > 0 && (
        <div className="sdex-detail-section">
          <h4>사용 용병</h4>
          <div className="sdex-users">
            {users.map((name) => (
              <span key={name} className="sdex-user-tag">{name}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
