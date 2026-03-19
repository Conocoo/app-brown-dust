import type { MercenaryTemplate } from '../../../types/mercenary'

export const gunther: MercenaryTemplate = {
  id: 'gunther',
  name: '군터',
  type: 'attacker',
  star: 5,
  maxHp: 5872,
  atk: 1112,
  def: 10,
  emoji: '⚔️',
  imageId: '1345',
  critRate: 30,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'x_shape',
    rangeSize: 1,
    effects: [],
  },
}
