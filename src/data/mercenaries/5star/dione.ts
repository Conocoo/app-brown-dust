import type { MercenaryTemplate } from '../../../types/mercenary'

export const dione: MercenaryTemplate = {
  id: 'dione',
  name: '디온느',
  type: 'attacker',
  star: 5,
  maxHp: 3022,
  atk: 2338,
  def: 10,
  emoji: '⚔️',
  imageId: '7005',
  critRate: 50,
  critDamage: 75,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [],
  },
}
