import type { MercenaryTemplate } from '../../../types/mercenary'

export const cecilia: MercenaryTemplate = {
  id: 'cecilia',
  name: '세실리아',
  type: 'defender',
  star: 5,
  maxHp: 16324,
  atk: 1118,
  def: 15,
  emoji: '🛡️',
  imageId: '2775',
  critRate: 10,
  critDamage: 50,
  agility: 10,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
      { type: 'shield', value: 30, duration: 999, buffType: 'shield', target: 'self' },
      { type: 'count_guard', value: 0, duration: 4, buffType: 'special', target: 'self' },
      { type: 'dot', value: 0.5, debuffClass: 'dot' },
    ],
  },
}
