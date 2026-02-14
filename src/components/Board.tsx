import type { BattleCharacter } from '../types/game'
import Cell from './Cell'

const PLAYER_COLS = 6

interface BoardProps {
  /** 3x12 격자: [row][col], col 0-5는 플레이어, col 6-11은 적 */
  grid: (BattleCharacter | null)[][]
  onCellClick: (row: number, col: number) => void
  onCellRightClick: (row: number, col: number) => void
  selectedCell: { row: number; col: number } | null
  disabled: boolean
  currentRound?: number
  onDragStart?: (row: number, col: number) => void
  onDragOver?: (e: React.DragEvent, row: number, col: number) => void
  onDrop?: (row: number, col: number) => void
}

export default function Board({
  grid, onCellClick, onCellRightClick, selectedCell, disabled, currentRound,
  onDragStart, onDragOver, onDrop,
}: BoardProps) {
  return (
    <div className="board">
      <div className="board-header">
        <span className="board-label">내 팀</span>
        {currentRound !== undefined && (
          <span className="board-round">라운드 {currentRound}</span>
        )}
        <span className="board-label">상대 팀</span>
      </div>
      <div className="board-grid">
        {/* 플레이어 영역 */}
        <div className="board-side board-side-player">
          {grid.map((row, rowIdx) =>
            row.slice(0, PLAYER_COLS).map((char, colIdx) => (
              <Cell
                key={`${rowIdx}-${colIdx}`}
                character={char}
                isPlayerSide={true}
                isSelected={selectedCell?.row === rowIdx && selectedCell?.col === colIdx}
                onClick={() => onCellClick(rowIdx, colIdx)}
                onRightClick={() => onCellRightClick(rowIdx, colIdx)}
                disabled={disabled}
                draggable={!disabled && char !== null && char.team === 'player'}
                onDragStart={() => onDragStart?.(rowIdx, colIdx)}
                onDragOver={(e) => onDragOver?.(e, rowIdx, colIdx)}
                onDrop={() => onDrop?.(rowIdx, colIdx)}
              />
            ))
          )}
        </div>
        {/* 간격 */}
        <div className="board-gap" />
        {/* 적 영역 */}
        <div className="board-side board-side-enemy">
          {grid.map((row, rowIdx) =>
            row.slice(PLAYER_COLS).map((char, colIdx) => (
              <Cell
                key={`${rowIdx}-${colIdx + PLAYER_COLS}`}
                character={char}
                isPlayerSide={false}
                isSelected={selectedCell?.row === rowIdx && selectedCell?.col === colIdx + PLAYER_COLS}
                onClick={() => onCellClick(rowIdx, colIdx + PLAYER_COLS)}
                onRightClick={() => onCellRightClick(rowIdx, colIdx + PLAYER_COLS)}
                disabled={disabled}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
