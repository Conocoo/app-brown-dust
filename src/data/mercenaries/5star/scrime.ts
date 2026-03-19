import type { MercenaryTemplate } from '../../../types/mercenary'

export const scrime: MercenaryTemplate = {
  id: 'scrime',
  name: '스크라임',
  type: 'attacker',
  star: 5,
  maxHp: 4891,
  atk: 1508,
  def: 0,
  emoji: '⚔️',
  imageId: '4305',
  critRate: 0,
  critDamage: 0,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [],
  },
}
