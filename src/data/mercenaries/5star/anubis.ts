import type { MercenaryTemplate } from '../../../types/mercenary'

export const anubis: MercenaryTemplate = {
  id: 'anubis',
  name: '아누비스',
  type: 'mage',
  star: 5,
  maxHp: 8804,
  atk: 1424,
  def: 0,
  emoji: '🔮',
  imageId: '1515',
  critRate: 20,
  critDamage: 50,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'small_cross',
    rangeSize: 1,
    effects: [],
  },
}
