import type { MercenaryTemplate } from '../../../types/mercenary'

export const kubera: MercenaryTemplate = {
  id: 'kubera',
  name: '쿠베라',
  type: 'mage',
  star: 5,
  maxHp: 4769,
  atk: 1518,
  def: 5,
  emoji: '🔮',
  imageId: '4525',
  critRate: 15,
  critDamage: 50,
  agility: 40,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [
      { type: 'on_attack_trigger', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
      { type: 'revival', value: 0, duration: 12, buffType: 'special', target: 'self' },
      { type: 'equipment', value: 0, duration: 2, buffType: 'stat_enhance', target: 'self' },
      { type: 'def_up', value: 50, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'temp_hp', value: 4, duration: 36, buffType: 'special', target: 'self' },
    ],
  },
}
