import type { MercenaryTemplate } from '../../../types/mercenary'

export const exile: MercenaryTemplate = {
  id: 'exile',
  name: '엑자일',
  type: 'defender',
  star: 4,
  maxHp: 8919,
  atk: 130,
  def: 15,
  emoji: '🛡️',
  imageId: '4095',
  critRate: 65,
  critDamage: 75,
  agility: 35,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'x_shape',
    rangeSize: 1,
    effects: [
      { type: 'revival', value: 0, duration: 1, debuffClass: 'stat_weaken' },
      { type: 'revival', value: 0, duration: 1, debuffClass: 'stat_weaken' },
      { type: 'equipment', value: 0, duration: 14, buffType: 'stat_enhance', target: 'self' },
      { type: 'taunt', value: 0, duration: 8, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
