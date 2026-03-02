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

          // 내부용 로그는 표시하지 않음
          if (log.type === 'status_update') return null

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
                <span className="log-team-label">{teamLabel}</span>
                {log.skillName && <span className="log-skill-badge log-skill-support">{log.skillName}</span>}
                {' '}{log.message}
                {log.isCritical && <span className="log-crit">치명타!</span>}
              </div>
            )
          }

          // buff, debuff, immune: message 기반 표시
          if (log.type === 'buff' || log.type === 'debuff' || log.type === 'immune') {
            return (
              <div key={originalIdx} className={`log-entry ${teamClass} ${log.defeated ? 'log-defeat' : ''}`}>
                {log.attackerTeam && <span className="log-team-label">{teamLabel}</span>}
                {' '}{log.message}
                {log.defeated && <span className="log-ko"> 쓰러짐!</span>}
              </div>
            )
          }

          // attack, reflect: 공격 템플릿
          return (
            <div key={originalIdx} className={`log-entry ${teamClass} ${log.defeated ? 'log-defeat' : ''}`}>
              <span className="log-team-label">{teamLabel}</span>
              {log.type === 'reflect'
                ? <span className="log-skill-badge log-skill-normal">반격</span>
                : log.skillName
                  ? <span className="log-skill-badge log-skill-attack">{log.skillName}</span>
                  : <span className="log-skill-badge log-skill-normal">일반공격</span>
              }
              {' '}
              <span>
                {log.attacker} → {log.defender}에게{' '}
                <strong>{log.damage}</strong> 데미지!
              </span>
              {log.isCritical && <span className="log-crit">치명타!</span>}
              {log.isGraze && <span className="log-graze">스침</span>}
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
