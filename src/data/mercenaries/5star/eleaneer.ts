import type { MercenaryTemplate } from '../../../types/mercenary'

export const eleaneer: MercenaryTemplate = {
  id: 'eleaneer',
  name: '에레니르',
  type: 'attacker',
  star: 5,
  maxHp: 4132,
  atk: 1220,
  def: 0,
  emoji: '⚔️',
  imageId: '3315',
  critRate: 75,
  critDamage: 50,
  agility: 65,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'back_n',
    rangeSize: 1,
    effects: [],
  },
}
