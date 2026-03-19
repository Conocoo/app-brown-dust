import type { MercenaryTemplate } from '../../../types/mercenary'

export const collab_3447: MercenaryTemplate = {
  id: 'collab_3447',
  name: 'メリオダス',
  type: 'defender',
  star: 5,
  maxHp: 13709,
  atk: 1118,
  def: 5,
  emoji: '🛡️',
  imageId: '3445',
  critRate: 25,
  critDamage: 75,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [],
  },
}
