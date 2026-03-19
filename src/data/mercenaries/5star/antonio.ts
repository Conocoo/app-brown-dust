import type { MercenaryTemplate } from '../../../types/mercenary'

export const antonio: MercenaryTemplate = {
  id: 'antonio',
  name: '안토니오',
  type: 'defender',
  star: 5,
  maxHp: 7438,
  atk: 1039,
  def: 0,
  emoji: '🛡️',
  imageId: '3585',
  critRate: 10,
  critDamage: 50,
  agility: 10,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'back_n',
    rangeSize: 2,
    effects: [],
  },
}
