import type { MercenaryTemplate } from '../../../types/mercenary'

export const minua: MercenaryTemplate = {
  id: 'minua',
  name: '미누아',
  type: 'mage',
  star: 5,
  maxHp: 2441,
  atk: 2872,
  def: 0,
  emoji: '🔮',
  imageId: '4365',
  critRate: 20,
  critDamage: 100,
  agility: 35,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'single',
    effects: [],
  },
}
