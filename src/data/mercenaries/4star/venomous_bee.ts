import type { MercenaryTemplate } from '../../../types/mercenary'

export const venomous_bee: MercenaryTemplate = {
  id: 'venomous_bee',
  name: '맹독벌',
  type: 'attacker',
  star: 4,
  maxHp: 98903,
  atk: 37,
  def: 100,
  emoji: '⚔️',
  imageId: '8338',
  critRate: 0,
  critDamage: 0,
  agility: 100,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'front_n',
    rangeSize: 1,
    effects: [],
  },
}
