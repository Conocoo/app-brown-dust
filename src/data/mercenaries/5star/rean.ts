import type { MercenaryTemplate } from '../../../types/mercenary'

export const rean: MercenaryTemplate = {
  id: 'rean',
  name: '린',
  type: 'attacker',
  star: 5,
  maxHp: 3612,
  atk: 1746,
  def: 0,
  emoji: '⚔️',
  imageId: '4215',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'front_n',
    rangeSize: 1,
    effects: [],
  },
}
