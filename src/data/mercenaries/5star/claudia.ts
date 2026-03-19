import type { MercenaryTemplate } from '../../../types/mercenary'

export const claudia: MercenaryTemplate = {
  id: 'claudia',
  name: '클라우디아',
  type: 'mage',
  star: 5,
  maxHp: 4480,
  atk: 885,
  def: 5,
  emoji: '🔮',
  imageId: '425',
  critRate: 10,
  critDamage: 25,
  agility: 35,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [],
  },
}
