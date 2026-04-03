// 개별 그리드 셀 — 배치 모드 / 전투 모드 공용

interface CellProps {
  name?: string
  emoji?: string
  hp?: number
  maxHp?: number
  isDead?: boolean
  isCasting?: boolean
  isSelected?: boolean
  isCurrent?: boolean
  mode: 'placing' | 'battle'
  onClick?: () => void
}

function hpColor(ratio: number): string {
  if (ratio > 0.6) return '#4caf50'
  if (ratio > 0.3) return '#f5a623'
  return '#e94560'
}

export default function Cell({
  name, emoji, hp, maxHp, isDead, isCasting,
  isSelected, isCurrent, mode, onClick,
}: CellProps) {
  const ratio = (hp != null && maxHp && maxHp > 0) ? hp / maxHp : 1
  const borderColor = isSelected ? '#e94560' : isCurrent ? '#f5a623' : '#0f3460'
  const borderWidth = (isSelected || isCurrent) ? '2px' : '1px'

  const isEmpty = !name

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        width: '90px',
        height: '90px',
        border: `${borderWidth} solid ${borderColor}`,
        borderRadius: '6px',
        background: isDead ? '#1a0a0a' : '#0f1e3a',
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {isEmpty ? (
        mode === 'placing' && (
          <span style={{ color: '#555', fontSize: '1.5rem' }}>+</span>
        )
      ) : (
        <>
          {/* 사망 오버레이 */}
          {isDead && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', zIndex: 2,
            }}>☠</div>
          )}

          {/* 캐스팅 링 */}
          {isCasting && !isDead && (
            <div style={{
              position: 'absolute', inset: '2px',
              border: '2px solid #f5a623',
              borderRadius: '4px',
              pointerEvents: 'none',
              zIndex: 1,
            }} />
          )}

          {/* 이모지 */}
          <div style={{ fontSize: '1.6rem', lineHeight: 1 }}>{emoji ?? '?'}</div>

          {/* 이름 */}
          <div style={{
            fontSize: '0.6rem',
            color: isDead ? '#666' : '#ccc',
            textAlign: 'center',
            marginTop: '2px',
            padding: '0 2px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            width: '100%',
          }}>{name}</div>

          {/* HP 수치 (전투 모드) */}
          {mode === 'battle' && hp != null && !isDead && (
            <div style={{ fontSize: '0.55rem', color: hpColor(ratio), marginTop: '1px' }}>
              {hp.toLocaleString()}
            </div>
          )}

          {/* HP 바 (전투 모드) */}
          {mode === 'battle' && hp != null && maxHp && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '6px', background: '#111' }}>
              <div style={{
                height: '100%',
                width: `${Math.max(0, ratio * 100)}%`,
                background: hpColor(ratio),
              }} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
