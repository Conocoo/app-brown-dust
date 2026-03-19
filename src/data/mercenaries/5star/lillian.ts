import type { MercenaryTemplate } from '../../../types/mercenary'

export const lillian: MercenaryTemplate = {
  id: 'lillian',
  name: '릴리안',
  type: 'mage',
  star: 5,
  maxHp: 3260,
  atk: 4826,
  def: 0,
  emoji: '🔮',
  imageId: '3345',
  critRate: 20,
  critDamage: 75,
  agility: 0,
  skill: {
    timing: 'passive',
    target: 'enemy_front',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [
      { type: 'count_guard', value: 0, duration: 20, buffType: 'special', target: 'self' },
      { type: 'def_up', value: 50, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'added_buff_27', value: 0, duration: 100, buffType: 'stat_enhance', target: 'self' },
      { type: 'crit_damage_up', value: 50, duration: 100, buffType: 'stat_enhance', target: 'self' },
      { type: 'shield', value: 99.9, duration: 999, buffType: 'shield', target: 'self' },
      { type: 'temp_hp', value: 3, duration: 30, buffType: 'special', atkScaling: true, target: 'self' },
    ],
  },
}
