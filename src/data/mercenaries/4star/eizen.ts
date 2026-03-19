import type { MercenaryTemplate } from '../../../types/mercenary'

export const eizen: MercenaryTemplate = {
  id: 'eizen',
  name: '아이젠',
  type: 'attacker',
  star: 4,
  maxHp: 2685,
  atk: 1205,
  def: 0,
  emoji: '⚔️',
  imageId: '4015',
  critRate: 10,
  critDamage: 50,
  agility: 30,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [],
  },
}
