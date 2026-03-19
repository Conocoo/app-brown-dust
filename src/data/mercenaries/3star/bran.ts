import type { MercenaryTemplate } from '../../../types/mercenary'

export const bran: MercenaryTemplate = {
  id: 'bran',
  name: '브란',
  type: 'attacker',
  star: 3,
  maxHp: 732,
  atk: 1761,
  def: 0,
  emoji: '⚔️',
  imageId: '525',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'single',
    effects: [],
  },
}
