import type { MercenaryTemplate } from '../../../types/mercenary'

export const venomous_frog: MercenaryTemplate = {
  id: 'venomous_frog',
  name: '맹독구리',
  type: 'attacker',
  star: 4,
  maxHp: 98903,
  atk: 19,
  def: 100,
  emoji: '⚔️',
  imageId: '8337',
  critRate: 0,
  critDamage: 0,
  agility: 100,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 5,
    effects: [],
  },
}
