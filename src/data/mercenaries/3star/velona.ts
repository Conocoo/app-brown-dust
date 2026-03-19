import type { MercenaryTemplate } from '../../../types/mercenary'

export const velona: MercenaryTemplate = {
  id: 'velona',
  name: '벨로나',
  type: 'mage',
  star: 3,
  maxHp: 2505,
  atk: 2020,
  def: 0,
  emoji: '🔮',
  imageId: '685',
  critRate: 20,
  critDamage: 75,
  agility: 5,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'x_shape',
    rangeSize: 1,
    effects: [],
  },
}
