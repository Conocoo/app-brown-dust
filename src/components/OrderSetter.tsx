import type { BattleCharacter } from '../types/game'

interface OrderSetterProps {
  characters: BattleCharacter[]
  onOrderSet: (ordered: BattleCharacter[]) => void
}

export default function OrderSetter({ characters, onOrderSet }: OrderSetterProps) {
  const ordered = characters.filter((c) => c.order >= 0).sort((a, b) => a.order - b.order)
  const unordered = characters.filter((c) => c.order < 0)

  // 좌클릭: 순서 부여만 (이미 순서가 있으면 무시)
  const handleClick = (char: BattleCharacter) => {
    if (char.order >= 0) return // 이미 순서가 있으면 좌클릭으로는 아무것도 안 함
    const nextOrder = ordered.length
    const updated = characters.map((c) => {
      if (c === char) return { ...c, order: nextOrder }
      return c
    })
    onOrderSet(updated)
  }

  // 우클릭: 순서 해제 (해당 캐릭터 이후 순서도 모두 리셋)
  const handleRightClick = (e: React.MouseEvent, char: BattleCharacter) => {
    e.preventDefault()
    if (char.order < 0) return // 순서가 없으면 무시
    const updated = characters.map((c) => {
      if (c.order >= char.order) return { ...c, order: -1 }
      return c
    })
    onOrderSet(updated)
  }

  const allOrdered = unordered.length === 0

  return (
    <div className="order-setter">
      <h3>공격 순서 지정</h3>
      <p className="order-hint">좌클릭: 순서 부여 / 우클릭: 순서 취소</p>
      <div className="order-cards">
        {characters.map((char, i) => (
          <button
            key={i}
            className={`order-card ${char.order >= 0 ? 'order-set' : ''}`}
            onClick={() => handleClick(char)}
            onContextMenu={(e) => handleRightClick(e, char)}
          >
            {char.order >= 0 && <span className="order-number">{char.order + 1}</span>}
            <span className="order-emoji">{char.emoji}</span>
            <span className="order-name">{char.name}</span>
            <span className="order-type">
              {char.type === 'attacker' && '공격형'}
              {char.type === 'defender' && '방어형'}
              {char.type === 'support' && '지원형'}
              {char.type === 'mage' && '마법형'}
            </span>
          </button>
        ))}
      </div>
      {!allOrdered && (
        <p className="order-remaining">
          남은 용병: {unordered.length}명
        </p>
      )}
    </div>
  )
}
