import type { MercenaryTemplate } from '../../../types/mercenary'

export const daniel: MercenaryTemplate = {
  id: 'daniel',
  name: '다니엘',
  type: 'support',
  star: 3,
  maxHp: 2255,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '2245',
  critRate: 0,
  critDamage: 0,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'next_ally',
    attackRange: 'x_shape',
    rangeSize: 1,
    effects: [
      { type: 'atk_up', value: 20, duration: 10, buffType: 'stat_enhance' },
    ],
  },
}
