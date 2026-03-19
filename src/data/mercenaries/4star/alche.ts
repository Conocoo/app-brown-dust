import type { MercenaryTemplate } from '../../../types/mercenary'

export const alche: MercenaryTemplate = {
  id: 'alche',
  name: '알체',
  type: 'attacker',
  star: 4,
  maxHp: 3738,
  atk: 870,
  def: 5,
  emoji: '⚔️',
  imageId: '2335',
  critRate: 40,
  critDamage: 50,
  agility: 5,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'x_shape',
    rangeSize: 1,
    effects: [],
  },
}
