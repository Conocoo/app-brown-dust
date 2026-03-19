import type { MercenaryTemplate } from '../../../types/mercenary'

export const rimuru_tempest: MercenaryTemplate = {
  id: 'rimuru_tempest',
  name: 'リムル',
  type: 'defender',
  star: 5,
  maxHp: 4566,
  atk: 1190,
  def: 5,
  emoji: '🛡️',
  imageId: '3955',
  critRate: 10,
  critDamage: 50,
  agility: 60,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'single',
    effects: [
      { type: 'added_buff_27', value: 0, duration: 12, buffType: 'stat_enhance', target: 'self' },
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'regeneration', value: 10, duration: 50, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
