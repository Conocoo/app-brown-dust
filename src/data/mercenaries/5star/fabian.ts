import type { MercenaryTemplate } from '../../../types/mercenary'

export const fabian: MercenaryTemplate = {
  id: 'fabian',
  name: '파비안',
  type: 'attacker',
  star: 5,
  maxHp: 13097,
  atk: 2638,
  def: 10,
  emoji: '⚔️',
  imageId: '7055',
  critRate: 10,
  critDamage: 100,
  agility: 20,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [],
  },
}
