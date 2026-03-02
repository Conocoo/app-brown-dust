import type { BattleCharacter } from '../types/game'

interface CellProps {
  character: BattleCharacter | null
  isPlayerSide: boolean
  isSelected: boolean
  onClick: () => void
  onRightClick: () => void
  disabled: boolean
  draggable?: boolean
  onDragStart?: () => void
  onDragOver?: (e: React.DragEvent) => void
  onDrop?: () => void
}

export default function Cell({
  character, isPlayerSide, isSelected, onClick, onRightClick, disabled,
  draggable: isDraggable, onDragStart, onDragOver, onDrop,
}: CellProps) {
  const hpPercent = character ? (character.hp / character.maxHp) * 100 : 0
  const isDefeated = character !== null && character.hp <= 0

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!disabled) onRightClick()
  }

  return (
    <div
      className={`cell ${isPlayerSide ? 'cell-player' : 'cell-enemy'} ${isSelected ? 'cell-selected' : ''} ${disabled ? 'cell-disabled' : ''} ${isDefeated ? 'cell-defeated' : ''}`}
      onClick={disabled ? undefined : onClick}
      onContextMenu={handleContextMenu}
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {character ? (
        <div className={`cell-character ${isDefeated ? 'cell-char-defeated' : ''}`}>
          <div className="cell-status">
            {character.isCasting && !isDefeated && <span className="status-casting" title="캐스팅 중">*</span>}
          </div>
          {character.imageId ? (
            <img className="cell-img" src={`/images/images_th/char${character.imageId}icon.png`} alt={character.name} />
          ) : (
            <>
              <span className="cell-emoji">{character.emoji}</span>
              <span className="cell-name">{character.name}</span>
            </>
          )}
          {isDefeated ? (
            <span className="cell-defeated-mark">X</span>
          ) : (
            <div className="hp-bar">
              <div
                className="hp-bar-fill"
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          )}
        </div>
      ) : (
        <span className="cell-empty">{isPlayerSide ? '+' : ''}</span>
      )}
    </div>
  )
}
