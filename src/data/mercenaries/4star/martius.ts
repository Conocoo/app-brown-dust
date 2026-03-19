import type { MercenaryTemplate } from '../../../types/mercenary'

export const martius: MercenaryTemplate = {
  id: 'martius',
  name: '마티어스',
  type: 'defender',
  star: 4,
  maxHp: 5608,
  atk: 1023,
  def: 10,
  emoji: '🛡️',
  imageId: '3795',
  critRate: 20,
  critDamage: 50,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [
      { type: 'crit_rate_up', value: 15, duration: 12, buffType: 'stat_enhance', target: 'self' },
      { type: 'crit_damage_up', value: 35, duration: 12, buffType: 'stat_enhance', target: 'self' },
      { type: 'equipment', value: 0, duration: 12, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
