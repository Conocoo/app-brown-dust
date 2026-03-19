import type { MercenaryTemplate } from '../../../types/mercenary'

export const sandstorm_master: MercenaryTemplate = {
  id: 'sandstorm_master',
  name: '모래바람 술사',
  type: 'support',
  star: 4,
  maxHp: 8955,
  atk: 0,
  def: 10,
  emoji: '💚',
  imageId: '8803',
  critRate: 20,
  critDamage: 100,
  agility: 35,
  skill: {
    timing: 'passive',
    target: 'next_ally',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [
      { type: 'shield', value: 99.9, duration: 12, buffType: 'shield' },
      { type: 'added_buff_27', value: 0, duration: 999, buffType: 'stat_enhance' },
      { type: 'damage_limit', value: 0.65, duration: 999, buffType: 'special' },
    ],
  },
}
