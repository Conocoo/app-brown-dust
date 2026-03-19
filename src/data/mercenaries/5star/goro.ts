import type { MercenaryTemplate } from '../../../types/mercenary'

export const goro: MercenaryTemplate = {
  id: 'goro',
  name: '고로',
  type: 'defender',
  star: 5,
  maxHp: 4178,
  atk: 2457,
  def: 15,
  emoji: '🛡️',
  imageId: '4505',
  critRate: 10,
  critDamage: 50,
  agility: 10,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'atk_down', value: 80, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'on_attack_trigger', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'temp_hp', value: 1, duration: 10, buffType: 'special', target: 'self' },
      { type: 'equipment', value: 0, duration: 10, buffType: 'stat_enhance', target: 'self' },
      { type: 'hp_up', value: 15000, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'shield', value: 30, duration: 20, buffType: 'shield', target: 'self' },
    ],
  },
}
