import { useState } from 'react'
import type { MercenaryTemplate } from '../types/mercenary'
import type { Skill } from '../types/skill'
import { getAllMercenaries } from '../data/mercenaries'
import { resolveSkills } from '../data/skills'

const TYPE_LABEL: Record<string, string> = {
  attacker: '공격형',
  defender: '방어형',
  support: '지원형',
  mage: '마법형',
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
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = selectedId
    ? mercenaries.find((m) => m.id === selectedId) ?? null
    : null

  const selectedSkills = selected ? resolveSkills(selected.skills) : []

  return (
    <div className="dex">
      <div className="dex-header">
        <button className="btn-back" onClick={onBack}>← 홈</button>
        <h2>용병 도감</h2>
        <span className="dex-count">{mercenaries.length}명</span>
      </div>

      <div className="dex-layout">
        <div className="dex-list">
          {mercenaries.map((m) => (
            <div
              key={m.id}
              className={`dex-card ${selectedId === m.id ? 'dex-card-selected' : ''}`}
              onClick={() => setSelectedId(m.id)}
            >
              <div className="dex-card-portrait">
                {m.imageId ? (
                  <img src={`/images/portraits/char${m.imageId}icon.png`} alt={m.name} />
                ) : (
                  <span className="dex-card-emoji">{m.emoji}</span>
                )}
              </div>
              <div className="dex-card-info">
                <span className="dex-card-name">{m.name}</span>
                <span className={`dex-card-type ci-type-${m.type}`}>
                  {'★'.repeat(m.star)} {TYPE_LABEL[m.type]}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="dex-detail">
          {selected ? (
            <MercDetail merc={selected} skills={selectedSkills} />
          ) : (
            <div className="dex-detail-empty">용병을 선택하세요</div>
          )}
        </div>
      </div>
    </div>
  )
}

function MercDetail({ merc, skills }: { merc: MercenaryTemplate; skills: Skill[] }) {
  return (
    <div className="dex-merc-detail">
      <div className="dex-merc-header">
        <div className="dex-merc-portrait">
          {merc.imageId ? (
            <img src={`/images/portraits/char${merc.imageId}icon.png`} alt={merc.name} />
          ) : (
            <span className="dex-merc-emoji">{merc.emoji}</span>
          )}
        </div>
        <div className="dex-merc-title">
          <h3>{merc.name}</h3>
          <span className={`ci-type-badge ci-type-${merc.type}`}>
            {'★'.repeat(merc.star)} {TYPE_LABEL[merc.type]}
          </span>
        </div>
      </div>

      <div className="dex-merc-stats">
        <div className="dex-stat-row">
          <span className="dex-stat">❤️ HP {merc.maxHp}</span>
          {merc.type === 'support'
            ? <span className="dex-stat">💚 지원력 {merc.supportPower}%</span>
            : <span className="dex-stat">⚔️ ATK {merc.atk}</span>
          }
          <span className="dex-stat">🛡️ DEF {merc.def}%</span>
        </div>
        <div className="dex-stat-row">
          <span className="dex-stat">적중 {merc.critRate}%</span>
          <span className="dex-stat">치명 {merc.critDamage}%</span>
          <span className="dex-stat">민첩 {merc.agility}%</span>
        </div>
        <div className="dex-stat-row">
          <span className="dex-stat">타겟 {TARGET_LABEL[merc.attackTarget ?? 'enemy_front']}</span>
          <span className="dex-stat">범위 {RANGE_LABEL[merc.attackRange ?? 'single']}{merc.rangeSize ? `(${merc.rangeSize})` : ''}</span>
          {merc.selfDestruct && <span className="dex-stat dex-stat-warn">자폭</span>}
        </div>
      </div>

      <div className="dex-merc-skills">
        <h4>스킬</h4>
        {skills.map((skill) => (
          <div key={skill.id} className={`dex-skill-item ci-skill-timing-${skill.timing}`}>
            <div className="dex-skill-header">
              <span className="dex-skill-name">{skill.name}</span>
              <span className="dex-skill-timing">{TIMING_LABEL[skill.timing]}</span>
              <span className="dex-skill-target">{TARGET_LABEL[skill.target] ?? skill.target}</span>
            </div>
            <div className="dex-skill-desc">{skillEffectDesc(skill)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
