import type { MercenaryTemplate } from '../../../types/mercenary'

export const kang: MercenaryTemplate = {
  id: 'kang',
  name: '캉',
  type: 'defender',
  star: 5,
  maxHp: 4566,
  atk: 6343,
  def: 5,
  emoji: '🛡️',
  imageId: '4375',
  critRate: 0,
  critDamage: 0,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [
      { type: 'atk_down', value: 80, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'on_attack_trigger', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'equipment', value: 65, duration: 12, buffType: 'stat_enhance', target: 'self' },
      { type: 'taunt', value: 0, duration: 6, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
