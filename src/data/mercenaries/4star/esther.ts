import type { MercenaryTemplate } from '../../../types/mercenary'

export const esther: MercenaryTemplate = {
  id: 'esther',
  name: '에스더',
  type: 'mage',
  star: 4,
  maxHp: 3205,
  atk: 2197,
  def: 0,
  emoji: '🔮',
  imageId: '1115',
  critRate: 30,
  critDamage: 75,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'x_shape',
    rangeSize: 1,
    effects: [],
  },
}
