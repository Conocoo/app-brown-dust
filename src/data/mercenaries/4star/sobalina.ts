import type { MercenaryTemplate } from '../../../types/mercenary'

export const sobalina: MercenaryTemplate = {
  id: 'sobalina',
  name: '소발리나',
  type: 'attacker',
  star: 4,
  maxHp: 1990,
  atk: 1990,
  def: 35,
  emoji: '⚔️',
  imageId: '8326',
  critRate: 100,
  critDamage: 50,
  agility: 100,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [],
  },
}
