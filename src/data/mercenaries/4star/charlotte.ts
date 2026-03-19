import type { MercenaryTemplate } from '../../../types/mercenary'

export const charlotte: MercenaryTemplate = {
  id: 'charlotte',
  name: '샬롯',
  type: 'mage',
  star: 4,
  maxHp: 2877,
  atk: 2105,
  def: 0,
  emoji: '🔮',
  imageId: '3815',
  critRate: 20,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'x_shape',
    rangeSize: 1,
    effects: [],
  },
}
