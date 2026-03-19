import type { MercenaryTemplate } from '../../../types/mercenary'

export const carlson: MercenaryTemplate = {
  id: 'carlson',
  name: '칼슨',
  type: 'defender',
  star: 3,
  maxHp: 6798,
  atk: 874,
  def: 12,
  emoji: '🛡️',
  imageId: '825',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'shield', value: 25, duration: 12, buffType: 'shield', target: 'self' },
      { type: 'equipment', value: 0, duration: 12, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
