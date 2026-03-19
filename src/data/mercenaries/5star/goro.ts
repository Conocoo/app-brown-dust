import type { MercenaryTemplate } from '../../../types/mercenary'

export const goro: MercenaryTemplate = {
  id: 'goro',
  name: '고로',
  type: 'defender',
  star: 5,
  maxHp: 4178,
  atk: 2457,
  def: 15,
  emoji: '🛡️',
  imageId: '4505',
  critRate: 10,
  critDamage: 50,
  agility: 10,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [],
  },
}
