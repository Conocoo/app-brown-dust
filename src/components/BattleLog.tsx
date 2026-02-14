import type { BattleLogEntry } from '../types/game'

interface BattleLogProps {
  logs: BattleLogEntry[]
  visibleCount: number
}

export default function BattleLog({ logs, visibleCount }: BattleLogProps) {
  // 최신 로그가 상단에 오도록 역순 표시
  const visible = logs.slice(0, visibleCount)
  const reversed = [...visible].reverse()

  return (
    <div className="battle-log">
      <h3>전투 로그</h3>
      <div className="log-entries">
        {reversed.map((log, i) => {
          // 원래 인덱스 (key용)
          const originalIdx = visibleCount - 1 - i

          if (log.type === 'round_start') {
            return (
              <div key={originalIdx} className="log-entry log-round">
                ── {log.message} ──
              </div>
            )
          }

          const teamClass = log.attackerTeam === 'player' ? 'log-player-action' : 'log-enemy-action'
          const teamLabel = log.attackerTeam === 'player' ? '[아군]' : '[적군]'

          if (log.type === 'casting') {
            return (
              <div key={originalIdx} className={`log-entry log-casting ${teamClass}`}>
                <span className="log-team-label">{teamLabel}</span> {log.message}
              </div>
            )
          }

          if (log.type === 'support') {
            return (
              <div key={originalIdx} className={`log-entry log-support ${teamClass}`}>
                <span className="log-team-label">{teamLabel}</span> {log.message}
              </div>
            )
          }

          return (
            <div key={originalIdx} className={`log-entry ${teamClass} ${log.defeated ? 'log-defeat' : ''}`}>
              <span className="log-team-label">{teamLabel}</span>{' '}
              <span>
                {log.attacker} → {log.defender}에게{' '}
                <strong>{log.damage}</strong> 데미지!
              </span>
              {log.defeated && <span className="log-ko"> 쓰러짐!</span>}
            </div>
          )
        })}
        {visibleCount < logs.length && visibleCount > 0 && (
          <div className="log-entry log-loading">전투 진행 중...</div>
        )}
      </div>
    </div>
  )
}
