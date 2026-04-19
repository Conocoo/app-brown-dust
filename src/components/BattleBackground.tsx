import type { BackgroundInfo } from '../types/background'

interface BattleBackgroundProps {
  bg: BackgroundInfo
}

export default function BattleBackground({ bg }: BattleBackgroundProps) {
  const tintRgba = `rgba(${bg.tint.r}, ${bg.tint.g}, ${bg.tint.b}, 0.35)`

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      overflow: 'hidden',
      borderRadius: '8px',
    }}>
      {/* 배경 이미지 */}
      <div style={{
        position: 'absolute',
        inset: '-10px',
        backgroundImage: `url("${bg.imagePath}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(4px) saturate(1.2)',
      }} />
      {/* 환경광 틴트 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: tintRgba,
        mixBlendMode: 'multiply',
      }} />
    </div>
  )
}
