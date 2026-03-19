import type { MercenaryTemplate } from '../../../types/mercenary'

export const gobta: MercenaryTemplate = {
  id: 'gobta',
  name: 'ゴブタ',
  type: 'defender',
  star: 4,
  maxHp: 5754,
  atk: 1008,
  def: 0,
  emoji: '🛡️',
  imageId: '3985',
  critRate: 10,
  critDamage: 50,
  agility: 40,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'single',
    effects: [],
  },
}
