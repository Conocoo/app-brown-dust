import type { MercenaryTemplate } from '../../../types/mercenary'

export const gurorang: MercenaryTemplate = {
  id: 'gurorang',
  name: '구로랑',
  type: 'mage',
  star: 3,
  maxHp: 2505,
  atk: 4458,
  def: 1,
  emoji: '🔮',
  imageId: '2145',
  critRate: 20,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [],
  },
}
