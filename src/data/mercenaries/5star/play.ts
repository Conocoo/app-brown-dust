import type { MercenaryTemplate } from '../../../types/mercenary'

export const play: MercenaryTemplate = {
  id: 'play',
  name: '플레이',
  type: 'mage',
  star: 5,
  maxHp: 2441,
  atk: 1253,
  def: 5,
  emoji: '🔮',
  imageId: '4645',
  critRate: 10,
  critDamage: 50,
  agility: 50,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'horizontal',
    rangeSize: 2,
    effects: [],
  },
}
