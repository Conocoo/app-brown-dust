import type { CharacterTemplate } from '../types/game'

interface CharacterListProps {
  characters: CharacterTemplate[]
  placedIds: string[]
  selectedId: string | null
  onSelect: (id: string) => void
  onDragStart?: (id: string) => void
  disabled: boolean
}

export default function CharacterList({
  characters,
  placedIds,
  selectedId,
  onSelect,
  onDragStart,
  disabled,
}: CharacterListProps) {
  return (
    <div className="character-list">
      <h3>용병 목록</h3>
      <p className="character-list-hint">용병을 선택한 뒤 내 팀 격자를 클릭하거나, 드래그해서 배치하세요</p>
      <div className="character-cards">
        {characters.map((char) => {
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
              <span className="card-emoji">{char.emoji}</span>
              <span className="card-name">{char.name}</span>
              <div className="card-stats">
                <span>❤️ {char.maxHp}</span>
                <span>⚔️ {char.atk}</span>
                <span>🛡️ {char.def}</span>
              </div>
              {isPlaced && <span className="card-badge">배치됨</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
