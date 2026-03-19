import type { MercenaryTemplate } from '../../../types/mercenary'

export const venomous_leech: MercenaryTemplate = {
  id: 'venomous_leech',
  name: '맹독어머리',
  type: 'defender',
  star: 4,
  maxHp: 41790,
  atk: 318,
  def: 0,
  emoji: '🛡️',
  imageId: '8340',
  critRate: 0,
  critDamage: 0,
  agility: 0,
  skill: {
    timing: 'passive',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'range_shrink', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'regeneration', value: 25, duration: 999, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
