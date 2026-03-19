import type { MercenaryTemplate } from '../../../types/mercenary'

export const tiara: MercenaryTemplate = {
  id: 'tiara',
  name: '티아라',
  type: 'defender',
  star: 3,
  maxHp: 5064,
  atk: 763,
  def: 10,
  emoji: '🛡️',
  imageId: '595',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'stun', value: 0, duration: 6, debuffClass: 'cc' },
      { type: 'equipment', value: 0, duration: 12, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
