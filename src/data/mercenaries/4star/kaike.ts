import type { MercenaryTemplate } from '../../../types/mercenary'

export const kaike: MercenaryTemplate = {
  id: 'kaike',
  name: '케이케',
  type: 'mage',
  star: 4,
  maxHp: 3738,
  atk: 877,
  def: 5,
  emoji: '🔮',
  imageId: '4385',
  critRate: 20,
  critDamage: 50,
  agility: 10,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'x_shape',
    rangeSize: 1,
    effects: [],
  },
}
