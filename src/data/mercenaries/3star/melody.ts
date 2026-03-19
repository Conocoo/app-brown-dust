import type { MercenaryTemplate } from '../../../types/mercenary'

export const melody: MercenaryTemplate = {
  id: 'melody',
  name: '멜로디',
  type: 'mage',
  star: 3,
  maxHp: 2876,
  atk: 4635,
  def: 0,
  emoji: '🔮',
  imageId: '725',
  critRate: 20,
  critDamage: 75,
  agility: 5,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'single',
    effects: [],
  },
}
