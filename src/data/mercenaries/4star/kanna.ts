import type { MercenaryTemplate } from '../../../types/mercenary'

export const kanna: MercenaryTemplate = {
  id: 'kanna',
  name: '칸나',
  type: 'attacker',
  star: 4,
  maxHp: 3837,
  atk: 880,
  def: 0,
  emoji: '⚔️',
  imageId: '3765',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [],
  },
}
