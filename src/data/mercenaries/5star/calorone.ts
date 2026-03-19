import type { MercenaryTemplate } from '../../../types/mercenary'

export const calorone: MercenaryTemplate = {
  id: 'calorone',
  name: '칼라론',
  type: 'defender',
  star: 5,
  maxHp: 26122,
  atk: 1536,
  def: 10,
  emoji: '🛡️',
  imageId: '4085',
  critRate: 65,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'dot', value: 0.45, debuffClass: 'dot' },
    ],
  },
}
