import type { MercenaryTemplate } from '../../../types/mercenary'

export const tenbu: MercenaryTemplate = {
  id: 'tenbu',
  name: '텐부',
  type: 'defender',
  star: 4,
  maxHp: 3980,
  atk: 3980,
  def: 80,
  emoji: '🛡️',
  imageId: '8329',
  critRate: 0,
  critDamage: 0,
  agility: 100,
  skill: {
    timing: 'passive',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'range_shrink', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
