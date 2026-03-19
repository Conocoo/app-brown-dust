import type { MercenaryTemplate } from '../../../types/mercenary'

export const dr_logic: MercenaryTemplate = {
  id: 'dr_logic',
  name: 'Dr. 로직',
  type: 'mage',
  star: 4,
  maxHp: 3451,
  atk: 953,
  def: 5,
  emoji: '🔮',
  imageId: '3605',
  critRate: 20,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [],
  },
}
