// 전투 재생 컨트롤

interface BattleControlsProps {
  isPlaying: boolean
  speed: number
  currentIdx: number
  totalSteps: number
  onPlay: () => void
  onPause: () => void
  onStep: () => void
  onStepBack: () => void
  onSpeedChange: (speed: number) => void
  onReset: () => void
}

const SPEEDS = [
  { label: '0.5×', ms: 600 },
  { label: '1×', ms: 300 },
  { label: '2×', ms: 150 },
  { label: '5×', ms: 60 },
  { label: '최대', ms: 0 },
]

export default function BattleControls({
  isPlaying, speed, currentIdx, totalSteps,
  onPlay, onPause, onStep, onStepBack, onSpeedChange, onReset,
}: BattleControlsProps) {
  const progress = totalSteps > 0 ? (currentIdx / totalSteps) * 100 : 0

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      background: '#16213e',
      borderRadius: '8px',
      padding: '0.6rem 1rem',
      flexWrap: 'wrap',
    }}>
      {/* 재생 컨트롤 */}
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        <button className="test-btn" onClick={onReset} style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}>⏮</button>
        <button className="test-btn" onClick={onStepBack} disabled={currentIdx === 0} style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}>◀</button>
        <button
          className="test-btn"
          onClick={isPlaying ? onPause : onPlay}
          disabled={currentIdx >= totalSteps}
          style={{ padding: '0.3rem 1rem', fontSize: '0.8rem', minWidth: '60px' }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button className="test-btn" onClick={onStep} disabled={currentIdx >= totalSteps} style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}>▶|</button>
      </div>

      {/* 속도 선택 */}
      <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: '#888' }}>속도:</span>
        {SPEEDS.map(s => (
          <button
            key={s.ms}
            className="test-btn"
            onClick={() => onSpeedChange(s.ms)}
            style={{
              padding: '0.2rem 0.5rem',
              fontSize: '0.72rem',
              background: speed === s.ms ? '#e94560' : '#2a2a4a',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* 진행 바 */}
      <div style={{ flex: 1, minWidth: '100px' }}>
        <div style={{ height: '4px', background: '#0f3460', borderRadius: '2px' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: '#e94560', borderRadius: '2px' }} />
        </div>
        <div style={{ fontSize: '0.65rem', color: '#666', marginTop: '2px' }}>
          {currentIdx} / {totalSteps}
        </div>
      </div>
    </div>
  )
}
