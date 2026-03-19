import type { MercenaryTemplate } from '../../../types/mercenary'

export const nerua: MercenaryTemplate = {
  id: 'nerua',
  name: '네루아',
  type: 'mage',
  star: 5,
  maxHp: 1628,
  atk: 3859,
  def: 0,
  emoji: '🔮',
  imageId: '4195',
  critRate: 0,
  critDamage: 0,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [
      { type: 'crit_rate_up', value: 30, duration: 100, buffType: 'stat_enhance', target: 'self' },
      { type: 'crit_damage_up', value: 50, duration: 100, buffType: 'stat_enhance', target: 'self' },
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'regeneration', value: 5, duration: 12, buffType: 'stat_enhance', target: 'self' },
      { type: 'def_up', value: 100, duration: 12, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
