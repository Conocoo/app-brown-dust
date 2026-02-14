import type { CharacterTemplate } from '../types/game'

/** 기본 용병 5명 */
export const characters: CharacterTemplate[] = [
  {
    id: 'warrior',
    name: '검투사',
    type: 'attacker',
    maxHp: 120,
    atk: 30,
    def: 10,
    emoji: '⚔️',
  },
  {
    id: 'mage',
    name: '마법사',
    type: 'mage',
    maxHp: 80,
    atk: 45,
    def: 5,
    emoji: '🔮',
  },
  {
    id: 'archer',
    name: '궁수',
    type: 'attacker',
    maxHp: 90,
    atk: 35,
    def: 8,
    emoji: '🏹',
  },
  {
    id: 'healer',
    name: '성직자',
    type: 'support',
    maxHp: 100,
    atk: 0,
    def: 12,
    emoji: '💚',
  },
  {
    id: 'tank',
    name: '수호자',
    type: 'defender',
    maxHp: 180,
    atk: 15,
    def: 25,
    emoji: '🛡️',
  },
]
