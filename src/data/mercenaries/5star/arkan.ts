import type { MercenaryTemplate } from '../../../types/mercenary'

export const arkan: MercenaryTemplate = {
  id: 'arkan',
  name: '아르칸',
  type: 'defender',
  star: 5,
  maxHp: 29386,
  atk: 993,
  def: 0,
  emoji: '🛡️',
  imageId: '2315',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot_variant', value: 0.3, duration: 5, debuffClass: 'dot' },
      { type: 'stun', value: 0, duration: 5, debuffClass: 'cc' },
    ],
  },
}
