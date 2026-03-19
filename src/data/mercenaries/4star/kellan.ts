import type { MercenaryTemplate } from '../../../types/mercenary'

export const kellan: MercenaryTemplate = {
  id: 'kellan',
  name: '켈란',
  type: 'attacker',
  star: 4,
  maxHp: 4603,
  atk: 765,
  def: 5,
  emoji: '⚔️',
  imageId: '2855',
  critRate: 15,
  critDamage: 25,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [],
  },
}
