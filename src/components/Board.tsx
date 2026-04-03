// 3×3 팀 그리드 보드

import Cell from './Cell'
import type { BattleCharacter } from '../types/battle'

interface CharSnapshot {
  hp: number
  isDead: boolean
}

interface BoardProps {
  label: string
  /** 배치 모드: merc ID 9슬롯 */
  slots?: (string | null)[]
  /** 전투 모드: BattleCharacter 배열 */
  chars?: BattleCharacter[]
  /** 전투 모드: key → 현재 HP/사망 상태 */
  snapshot?: Map<string, CharSnapshot>
  /** 이름/이모지 조회 (배치 모드에서 mercId로 메타데이터 가져오기) */
  mercMeta?: Map<string, { name: string; emoji: string }>
  mode: 'placing' | 'battle'
  /** 선택된 슬롯 인덱스 (배치 모드) */
  selectedIdx?: number
  /** 현재 행동 중인 캐릭터 key (전투 모드) */
  currentKey?: string
  onCellClick?: (idx: number) => void
}

export default function Board({
  label, slots, chars, snapshot, mercMeta,
  mode, selectedIdx, currentKey, onCellClick,
}: BoardProps) {
  const ROWS = 3
  const COLS = 3

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ fontSize: '0.9rem', color: '#aaa', fontWeight: 600 }}>{label}</div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, 90px)`,
        gridTemplateRows: `repeat(${ROWS}, 90px)`,
        gap: '6px',
      }}>
        {Array.from({ length: ROWS * COLS }, (_, idx) => {
          const row = Math.floor(idx / COLS)
          const col = idx % COLS

          if (mode === 'placing') {
            const mercId = slots?.[idx] ?? null
            const meta = mercId ? mercMeta?.get(mercId) : undefined
            return (
              <Cell
                key={idx}
                mode="placing"
                name={meta?.name}
                emoji={meta?.emoji}
                isSelected={selectedIdx === idx}
                onClick={() => onCellClick?.(idx)}
              />
            )
          }

          // 전투 모드: chars 배열에서 row/col 매칭
          const char = chars?.find(c => c.row === row && c.col === col) ?? null
          const snap = char ? snapshot?.get(char.key) : undefined

          return (
            <Cell
              key={idx}
              mode="battle"
              name={char?.name}
              emoji={char?.emoji}
              hp={snap?.hp ?? char?.hp}
              maxHp={char?.maxHp}
              isDead={snap?.isDead ?? false}
              isCurrent={char?.key === currentKey}
              onClick={onCellClick ? () => onCellClick(idx) : undefined}
            />
          )
        })}
      </div>
    </div>
  )
}
