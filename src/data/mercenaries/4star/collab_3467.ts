import type { MercenaryTemplate } from '../../../types/mercenary'

export const collab_3467: MercenaryTemplate = {
  id: 'collab_3467',
  name: 'ディアンヌ',
  type: 'defender',
  star: 4,
  maxHp: 5923,
  atk: 1017,
  def: 10,
  emoji: '🛡️',
  imageId: '3465',
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
