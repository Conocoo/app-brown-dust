import type { MercenaryTemplate } from '../../../types/mercenary'

export const haruna: MercenaryTemplate = {
  id: 'haruna',
  name: '하루나',
  type: 'mage',
  star: 5,
  maxHp: 3260,
  atk: 3786,
  def: 5,
  emoji: '🔮',
  imageId: '4405',
  critRate: 40,
  critDamage: 100,
  agility: 0,
  skill: {
    timing: 'passive',
    target: 'enemy_second',
    attackRange: 'single',
    effects: [
      { type: 'insert_buff', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'insert_buff', value: 0, duration: 60, buffType: 'stat_enhance', target: 'self' },
      { type: 'temp_hp', value: 2, duration: 20, buffType: 'special', atkScaling: true, target: 'self' },
      { type: 'insert_buff', value: 0, duration: 60, buffType: 'stat_enhance', target: 'self' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
