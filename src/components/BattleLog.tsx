// 전투 로그 패널

import { useEffect, useRef } from 'react'
import type { BattleLogEntry } from '../types/battle'

interface BattleLogProps {
  log: BattleLogEntry[]
  currentIdx: number
}

const LOG_COLORS: Record<string, string> = {
  round_start: '#7ec8e3',
  turn_start: '#666',
  casting: '#f5a623',
  attack: '#e8e8e8',
  skill_effect: '#b8e8b8',
  buff_applied: '#c8d8f8',
  buff_expired: '#777',
  dot_damage: '#f5a623',
  dot_heal: '#4caf50',
  death: '#e94560',
  revival: '#4caf50',
  instead_death: '#f5a623',
  battle_end: '#e94560',
}

export default function BattleLog({ log, currentIdx }: BattleLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [currentIdx])

  const visible = log.slice(0, currentIdx)

  return (
    <div style={{
      flex: 1,
      background: '#0f1e3a',
      border: '1px solid #0f3460',
      borderRadius: '6px',
      padding: '0.5rem',
      overflowY: 'auto',
      fontSize: '0.72rem',
      lineHeight: 1.6,
      minWidth: 0,
    }}>
      {visible.map((entry, i) => (
        <div
          key={i}
          style={{
            color: LOG_COLORS[entry.type] ?? '#ccc',
            borderTop: entry.type === 'round_start' && i > 0 ? '1px solid #1a2a4a' : undefined,
            paddingTop: entry.type === 'round_start' ? '0.3rem' : undefined,
            fontWeight: (entry.type === 'round_start' || entry.type === 'battle_end') ? 600 : undefined,
          }}
        >
          {entry.detail}
          {entry.damage !== undefined && entry.type === 'attack' && (
            <span style={{ color: entry.isCritical ? '#f5a623' : '#aaa' }}>
              {' '}({entry.damage.toLocaleString()}{entry.isCritical ? ' 치명타' : ''}{entry.isDodge ? ' 스침' : ''})
            </span>
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
