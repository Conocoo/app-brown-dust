import type { MercenaryTemplate } from '../../../types/mercenary'

export const orc_general: MercenaryTemplate = {
  id: 'orc_general',
  name: 'オークジェネラル',
  type: 'defender',
  star: 5,
  maxHp: 3793,
  atk: 650,
  def: 20,
  emoji: '🛡️',
  imageId: '9507',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'passive',
    target: 'enemy_front',
    attackRange: 'back_n',
    rangeSize: 1,
    effects: [],
  },
}
