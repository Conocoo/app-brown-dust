import type { MercenaryTemplate } from '../../../types/mercenary'

export const varion: MercenaryTemplate = {
  id: 'varion',
  name: '바리온',
  type: 'attacker',
  star: 4,
  maxHp: 3642,
  atk: 909,
  def: 3,
  emoji: '⚔️',
  imageId: '2405',
  critRate: 10,
  critDamage: 50,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 2,
    effects: [],
  },
}
