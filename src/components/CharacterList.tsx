import { useState } from 'react'
import type { MercenaryTemplate, StarRating } from '../types/mercenary'
import type { CharacterType } from '../types/game'

interface CharacterListProps {
  characters: MercenaryTemplate[]
  placedIds: string[]
  selectedId: string | null
  onSelect: (id: string) => void
  onDragStart?: (id: string) => void
  disabled: boolean
}

type TypeFilter = 'all' | CharacterType

const TYPE_LABELS: Record<TypeFilter, string> = {
  all: '전체',
  attacker: '공격형',
  defender: '방어형',
  mage: '마법형',
  support: '지원형',
}

export default function CharacterList({
  characters,
  placedIds,
  selectedId,
  onSelect,
  onDragStart,
  disabled,
}: CharacterListProps) {
  const [starFilter, setStarFilter] = useState<StarRating>(5)
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')

  const filtered = characters.filter((c) => {
    if (c.star !== starFilter) return false
    if (typeFilter !== 'all' && c.type !== typeFilter) return false
    return true
  })

  return (
    <div className="character-list">
      <div className="clist-filters">
        <div className="clist-star-tabs">
          {([3, 4, 5] as StarRating[]).map((star) => (
            <button
              key={star}
              className={`clist-star-tab ${starFilter === star ? 'clist-star-active' : ''} clist-star-${star}`}
              onClick={() => setStarFilter(star)}
            >
              {star}★
            </button>
          ))}
        </div>
        <div className="clist-type-tabs">
          {(['all', 'attacker', 'defender', 'mage', 'support'] as TypeFilter[]).map((t) => (
            <button
              key={t}
              className={`clist-type-tab ${typeFilter === t ? 'clist-type-active' : ''} ${t !== 'all' ? `clist-type-${t}` : ''}`}
              onClick={() => setTypeFilter(t)}
            >
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>
      <div className="character-cards">
        {filtered.map((char) => {
          const isPlaced = placedIds.includes(char.id)
          const isActive = selectedId === char.id
          return (
            <button
              key={char.id}
              className={`character-card ${isActive ? 'card-active' : ''} ${isPlaced ? 'card-placed' : ''}`}
              onClick={() => onSelect(char.id)}
              disabled={disabled || isPlaced}
              draggable={!disabled && !isPlaced}
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = 'move'
                onDragStart?.(char.id)
              }}
            >
              {char.imageId ? (
                <img className="card-img" src={`/images/portraits/char${char.imageId}icon.png`} alt={char.name} />
              ) : (
                <span className="card-emoji">{char.emoji}</span>
              )}
              <span className="card-name">{char.name}</span>
              <div className="card-stats">
                <span>❤️ {char.maxHp}</span>
                <span>{char.type === 'support' ? `💚 ${char.supportPower ?? 0}%` : `⚔️ ${char.atk}`}</span>
                <span>🛡️ {char.def}</span>
              </div>
              {isPlaced && <span className="card-badge">배치됨</span>}
            </button>
          )
        })}
        {filtered.length === 0 && (
          <p className="clist-empty">해당 조건의 용병이 없습니다</p>
        )}
      </div>
    </div>
  )
}
