import type { MercenaryTemplate } from '../../../types/mercenary'

export const iris: MercenaryTemplate = {
  id: 'iris',
  name: '이리스',
  type: 'defender',
  star: 4,
  maxHp: 8635,
  atk: 1001,
  def: 10,
  emoji: '🛡️',
  imageId: '2175',
  critRate: 10,
  critDamage: 50,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'x_shape',
    rangeSize: 1,
    effects: [
      { type: 'charm', value: 0, duration: 12, debuffClass: 'cc' },
      { type: 'position_change', value: 0, duration: 12, debuffClass: 'cc' },
      { type: 'equipment', value: 0, duration: 18, buffType: 'stat_enhance', target: 'self' },
      { type: 'taunt', value: 0, duration: 12, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
