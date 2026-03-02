import { useState, useEffect } from 'react'
import type { BattleCharacter, Rune, RuneStat } from '../types/game'
import { RUNE_VALUES } from '../data/runeValues'

interface Props {
  character: BattleCharacter | null
  isBattle: boolean
  isPlacing?: boolean
  onRuneChange?: (runes: Rune[]) => void
}

const TYPE_LABEL: Record<string, string> = {
  attacker: '공격형',
  defender: '방어형',
  support: '지원형',
  mage: '마법형',
}

const STAT_LABELS: Record<RuneStat, string> = {
  hp_percent:  '체력(%)',
  hp_flat:     '체력(고정)',
  atk_percent: '공격력(%)',
  atk_flat:    '공격력(고정)',
  def:         '방어력',
  crit_rate:   '치명률',
  crit_damage: '치명피해',
}

const ALL_STATS: RuneStat[] = [
  'hp_percent', 'hp_flat', 'atk_percent', 'atk_flat', 'def', 'crit_rate', 'crit_damage',
]

function runeValueStr(stat: RuneStat, value: number): string {
  if (stat === 'hp_flat' || stat === 'atk_flat') return `+${value}`
  return `+${value}%`
}

function runeSummary(rune: Rune): string {
  const typeLabel = rune.type === 'single' ? '단일' : '듀얼'
  const main = `${STAT_LABELS[rune.main.stat]} ${runeValueStr(rune.main.stat, rune.main.value)}`
  const main2 = rune.main2 ? ` / ${STAT_LABELS[rune.main2.stat]} ${runeValueStr(rune.main2.stat, rune.main2.value)}` : ''
  const sub = rune.sub ? `  서브: ${STAT_LABELS[rune.sub.stat]} ${runeValueStr(rune.sub.stat, rune.sub.value)}` : ''
  return `[${typeLabel}] ${main}${main2}${sub}`
}

export default function CharacterInfo({ character, isBattle, isPlacing, onRuneChange }: Props) {
  const [editingSlot, setEditingSlot] = useState<0 | 1 | null>(null)
  const [draftType, setDraftType] = useState<'single' | 'dual'>('single')
  const [draftMain, setDraftMain] = useState<RuneStat | ''>('')
  const [draftMain2, setDraftMain2] = useState<RuneStat | ''>('')
  const [draftSub, setDraftSub] = useState<RuneStat | ''>('')

  useEffect(() => {
    setEditingSlot(null)
  }, [character?.templateId])

  if (!character) {
    return (
      <div className="character-info character-info-empty">
        용병을 클릭하면 정보가 표시됩니다
      </div>
    )
  }

  const hpPercent = Math.max(0, Math.round((character.hp / character.maxHp) * 100))

  function openEditor(slot: 0 | 1, existing: Rune | null) {
    if (existing) {
      setDraftType(existing.type)
      setDraftMain(existing.main.stat)
      setDraftMain2(existing.main2?.stat ?? '')
      setDraftSub(existing.sub?.stat ?? '')
    } else {
      setDraftType('single')
      setDraftMain('')
      setDraftMain2('')
      setDraftSub('')
    }
    setEditingSlot(slot)
  }

  function removeRune(slot: 0 | 1) {
    if (!onRuneChange || !character) return
    const newRunes = character.runes.filter((_, i) => i !== slot)
    onRuneChange(newRunes)
  }

  function applyRune() {
    if (!draftMain || !onRuneChange || editingSlot === null || !character) return
    const rune: Rune = {
      id: `rune-${Date.now()}`,
      type: draftType,
      main: {
        stat: draftMain,
        value: RUNE_VALUES[draftMain][draftType === 'single' ? 'single' : 'dualA'],
      },
      main2: draftType === 'dual' && draftMain2
        ? { stat: draftMain2, value: RUNE_VALUES[draftMain2].dualB }
        : undefined,
      sub: draftSub
        ? { stat: draftSub, value: RUNE_VALUES[draftSub].sub }
        : undefined,
    }
    const newRunes = [...character.runes]
    newRunes[editingSlot] = rune
    onRuneChange(newRunes)
    setEditingSlot(null)
  }

  const canApply =
    draftMain !== '' &&
    (draftType === 'single' || (draftMain2 !== '' && draftMain2 !== draftMain))

  // 서브에서 제외: 메인A와 같은 스탯은 불가
  const excludedFromSub = draftMain

  const showRunes = isPlacing || character.runes.length > 0

  return (
    <div className="character-info">
      <div className="ci-header">
        {character.imageId ? (
          <img className="ci-img" src={`/images/images/char${character.imageId}icon.png`} alt={character.name} />
        ) : (
          <span className="ci-emoji">{character.emoji}</span>
        )}
        <span className="ci-name">{character.name}</span>
        <span className={`ci-type-badge ci-type-${character.type}`}>
          {TYPE_LABEL[character.type] ?? character.type}
        </span>
        {character.order >= 0 && (
          <span className="ci-order">순서 {character.order + 1}</span>
        )}
      </div>

      <div className="ci-hp-row">
        <div className="ci-hp-bar">
          <div className="ci-hp-bar-fill" style={{ width: `${hpPercent}%` }} />
        </div>
        <span className="ci-hp-text">
          {character.hp} / {character.maxHp}
        </span>
      </div>

      <div className="ci-stats">
        {character.type === 'support'
          ? <span className="ci-stat"><span className="ci-stat-label">지원력</span> {character.supportPower}%</span>
          : <span className="ci-stat"><span className="ci-stat-label">ATK</span> {character.atk}</span>
        }
        <span className="ci-stat"><span className="ci-stat-label">DEF</span> {character.def}%</span>
        <span className="ci-stat"><span className="ci-stat-label">치명</span> {character.critRate}%</span>
        <span className="ci-stat"><span className="ci-stat-label">치명피해</span> {character.critDamage}%</span>
        <span className="ci-stat"><span className="ci-stat-label">민첩</span> {character.agility}</span>
      </div>

      {showRunes && (
        <div className="ci-runes">
          {([0, 1] as const).map((slot) => {
            const rune = character.runes[slot]

            // 에디터 열린 상태 (배치 단계 전용)
            if (isPlacing && editingSlot === slot) {
              return (
                <div key={slot} className="ci-rune-editor">
                  <div className="ci-rune-editor-row">
                    <span className="ci-rune-editor-label">타입</span>
                    <div className="ci-rune-type-btns">
                      <button
                        className={draftType === 'single' ? 'active' : ''}
                        onClick={() => { setDraftType('single'); setDraftMain2('') }}
                      >단일</button>
                      <button
                        className={draftType === 'dual' ? 'active' : ''}
                        onClick={() => setDraftType('dual')}
                      >듀얼</button>
                    </div>
                  </div>

                  <div className="ci-rune-editor-row">
                    <span className="ci-rune-editor-label">메인</span>
                    <select value={draftMain} onChange={(e) => setDraftMain(e.target.value as RuneStat | '')}>
                      <option value="">선택</option>
                      {ALL_STATS.map((s) => (
                        <option key={s} value={s}>
                          {STAT_LABELS[s]} → {RUNE_VALUES[s][draftType === 'single' ? 'single' : 'dualA']}
                          {(s === 'hp_flat' || s === 'atk_flat') ? '' : '%'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {draftType === 'dual' && (
                    <div className="ci-rune-editor-row">
                      <span className="ci-rune-editor-label">메인B</span>
                      <select value={draftMain2} onChange={(e) => setDraftMain2(e.target.value as RuneStat | '')}>
                        <option value="">선택</option>
                        {ALL_STATS.filter((s) => s !== draftMain).map((s) => (
                          <option key={s} value={s}>
                            {STAT_LABELS[s]} → {RUNE_VALUES[s].dualB}
                            {(s === 'hp_flat' || s === 'atk_flat') ? '' : '%'}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="ci-rune-editor-row">
                    <span className="ci-rune-editor-label">서브</span>
                    <select value={draftSub} onChange={(e) => setDraftSub(e.target.value as RuneStat | '')}>
                      <option value="">없음</option>
                      {ALL_STATS.filter((s) => s !== excludedFromSub).map((s) => (
                        <option key={s} value={s}>
                          {STAT_LABELS[s]} → {RUNE_VALUES[s].sub}
                          {(s === 'hp_flat' || s === 'atk_flat') ? '' : '%'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="ci-rune-editor-actions">
                    <button className="btn-rune-apply" onClick={applyRune} disabled={!canApply}>
                      장착
                    </button>
                    <button className="btn-rune-cancel" onClick={() => setEditingSlot(null)}>
                      닫기
                    </button>
                  </div>
                </div>
              )
            }

            // 장착된 룬 표시
            if (rune) {
              return (
                <div key={slot} className="ci-rune-equipped">
                  <span className="ci-rune-summary">{runeSummary(rune)}</span>
                  {isPlacing && (
                    <>
                      <button className="btn-rune-edit" onClick={() => openEditor(slot, rune)}>변경</button>
                      <button className="btn-rune-remove" onClick={() => removeRune(slot)}>제거</button>
                    </>
                  )}
                </div>
              )
            }

            // 빈 슬롯 (배치 단계에서만 표시)
            if (isPlacing) {
              return (
                <button key={slot} className="ci-rune-empty" onClick={() => openEditor(slot, null)}>
                  슬롯 {slot + 1} — 빈 슬롯 (클릭하여 장착)
                </button>
              )
            }

            return null
          })}
        </div>
      )}

      {isBattle && character.statusEffects.length > 0 && (
        <div className="ci-effects">
          {character.statusEffects.map((e) => (
            <span key={e.id} className={`ci-effect-badge ${e.category}`}>
              {e.type}
              {e.value !== 0 && ` ${e.value}`}
              {` (${e.remainingTurns}턴)`}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
