import type { MercenaryTemplate } from '../../../types/mercenary'

export const rogan: MercenaryTemplate = {
  id: 'rogan',
  name: '로건',
  type: 'attacker',
  star: 5,
  maxHp: 8705,
  atk: 1490,
  def: 5,
  emoji: '⚔️',
  imageId: '1365',
  critRate: 35,
  critDamage: 75,
  agility: 5,
  skill: {
    timing: 'passive',
    target: 'enemy_front',
    attackRange: 'cross',
    rangeSize: 1,
    effects: [
      { type: 'atk_up', value: 10, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'added_buff_25', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'revival', value: 0, duration: 26, buffType: 'special', target: 'self' },
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
