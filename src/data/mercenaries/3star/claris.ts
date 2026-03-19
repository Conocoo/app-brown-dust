import type { MercenaryTemplate } from '../../../types/mercenary'

export const claris: MercenaryTemplate = {
  id: 'claris',
  name: '클라리스',
  type: 'support',
  star: 3,
  maxHp: 2150,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '765',
  critRate: 0,
  critDamage: 0,
  agility: 5,
  skill: {
    timing: 'after_attack',
    target: 'next_ally',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [
      { type: 'on_death_trigger', value: 0, duration: 24, buffType: 'stat_enhance' },
    ],
  },
}
