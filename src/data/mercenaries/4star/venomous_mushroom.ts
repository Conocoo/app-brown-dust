import type { MercenaryTemplate } from '../../../types/mercenary'

export const venomous_mushroom: MercenaryTemplate = {
  id: 'venomous_mushroom',
  name: '맹독 기생버섯',
  type: 'defender',
  star: 4,
  maxHp: 5014,
  atk: 199,
  def: 0,
  emoji: '🛡️',
  imageId: '8339',
  critRate: 0,
  critDamage: 0,
  agility: 40,
  skill: {
    timing: 'passive',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'counter_attack', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'shield', value: 70, duration: 999, buffType: 'shield', target: 'self' },
    ],
  },
}
