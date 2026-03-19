import type { MercenaryTemplate } from '../../../types/mercenary'

export const elija: MercenaryTemplate = {
  id: 'elija',
  name: '일라이자',
  type: 'attacker',
  star: 5,
  maxHp: 5872,
  atk: 1480,
  def: 10,
  emoji: '⚔️',
  imageId: '1575',
  critRate: 15,
  critDamage: 50,
  agility: 25,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [],
  },
}
