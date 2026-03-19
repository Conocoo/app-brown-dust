import type { MercenaryTemplate } from '../../../types/mercenary'

export const eunice: MercenaryTemplate = {
  id: 'eunice',
  name: '유니스',
  type: 'support',
  star: 3,
  maxHp: 2212,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '2295',
  critRate: 0,
  critDamage: 0,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'next_ally',
    attackRange: 'x_shape',
    rangeSize: 1,
    effects: [
      { type: 'regeneration', value: 2, duration: 5, buffType: 'stat_enhance' },
      { type: 'atk_up', value: 20, duration: 10, buffType: 'stat_enhance' },
    ],
  },
}
