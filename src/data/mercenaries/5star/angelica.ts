import type { MercenaryTemplate } from '../../../types/mercenary'

export const angelica: MercenaryTemplate = {
  id: 'angelica',
  name: '안젤리카',
  type: 'attacker',
  star: 5,
  maxHp: 5207,
  atk: 20136,
  def: 35,
  emoji: '⚔️',
  imageId: '1795',
  critRate: 25,
  critDamage: 150,
  agility: 35,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'single',
    effects: [],
  },
}
