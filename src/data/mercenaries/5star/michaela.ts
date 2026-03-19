import type { MercenaryTemplate } from '../../../types/mercenary'

export const michaela: MercenaryTemplate = {
  id: 'michaela',
  name: '미카엘라',
  type: 'support',
  star: 5,
  maxHp: 3776,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '2345',
  critRate: 0,
  critDamage: 0,
  agility: 10,
  skill: {
    timing: 'passive',
    target: 'next_ally',
    attackRange: 'back_n',
    rangeSize: 1,
    effects: [
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance' },
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance' },
    ],
  },
}
