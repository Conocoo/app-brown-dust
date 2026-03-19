import type { MercenaryTemplate } from '../../../types/mercenary'

export const kubera: MercenaryTemplate = {
  id: 'kubera',
  name: '쿠베라',
  type: 'mage',
  star: 5,
  maxHp: 4769,
  atk: 1518,
  def: 5,
  emoji: '🔮',
  imageId: '4525',
  critRate: 15,
  critDamage: 50,
  agility: 40,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [],
  },
}
