// 용병 선택 패널

import { useState } from 'react'
import { getAllMercenaries } from '../data/mercenaries'
import type { MercenaryData } from '../types/character'

interface MercenaryPickerProps {
  onSelect: (mercId: string) => void
  selectedId?: string | null
}

const TYPE_LABELS: Record<string, string> = {
  warrior: '전사', magic: '마법사', support: '지원', ranger: '레인저',
}

export default function MercenaryPicker({ onSelect, selectedId }: MercenaryPickerProps) {
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const all = getAllMercenaries()

  const filtered = all.filter((m: MercenaryData) => {
    if (typeFilter && m.type !== typeFilter) return false
    if (query && !m.name.includes(query) && !m.id.includes(query.toLowerCase())) return false
    return true
  })

  return (
    <div style={{
      width: '200px',
      flexShrink: 0,
      background: '#16213e',
      borderRadius: '8px',
      padding: '0.75rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      maxHeight: '500px',
    }}>
      <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>용병 선택</div>

      <input
        className="test-input"
        placeholder="이름 검색"
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem' }}
      />

      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
        {['', 'warrior', 'magic', 'support', 'ranger'].map(t => (
          <button
            key={t}
            className="test-btn"
            onClick={() => setTypeFilter(t)}
            style={{
              fontSize: '0.65rem',
              padding: '0.15rem 0.4rem',
              background: typeFilter === t ? '#e94560' : '#2a2a4a',
            }}
          >
            {t === '' ? '전체' : TYPE_LABELS[t] ?? t}
          </button>
        ))}
      </div>

      <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {filtered.map((m: MercenaryData) => (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            style={{
              textAlign: 'left',
              background: selectedId === m.id ? '#e94560' : 'transparent',
              border: '1px solid #1a2a4a',
              borderRadius: '4px',
              color: '#ddd',
              padding: '0.3rem 0.5rem',
              cursor: 'pointer',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>{m.emoji}</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {m.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
