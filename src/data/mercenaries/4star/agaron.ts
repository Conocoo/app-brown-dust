import type { MercenaryTemplate } from '../../../types/mercenary'

export const agaron: MercenaryTemplate = {
  id: 'agaron',
  name: '아가론',
  type: 'mage',
  star: 4,
  maxHp: 6616,
  atk: 1770,
  def: 15,
  emoji: '🔮',
  imageId: '1435',
  critRate: 15,
  critDamage: 50,
  agility: 20,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'front_n',
    rangeSize: 1,
    effects: [],
  },
}
