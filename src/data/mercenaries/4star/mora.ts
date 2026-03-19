import type { MercenaryTemplate } from '../../../types/mercenary'

export const mora: MercenaryTemplate = {
  id: 'mora',
  name: '모라',
  type: 'defender',
  star: 4,
  maxHp: 8057,
  atk: 1665,
  def: 10,
  emoji: '🛡️',
  imageId: '2165',
  critRate: 35,
  critDamage: 50,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'dot_drain', value: 0.45, buffType: 'stat_enhance', target: 'self' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
