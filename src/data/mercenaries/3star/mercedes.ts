import type { MercenaryTemplate } from '../../../types/mercenary'

export const mercedes: MercenaryTemplate = {
  id: 'mercedes',
  name: '메르세데스',
  type: 'defender',
  star: 3,
  maxHp: 5018,
  atk: 837,
  def: 10,
  emoji: '🛡️',
  imageId: '335',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'thorns', value: 0.45, duration: 10, buffType: 'special', target: 'self' },
      { type: 'taunt', value: 0, duration: 6, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
