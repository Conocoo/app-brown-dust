import type { MercenaryTemplate } from '../../../types/mercenary'

export const julie: MercenaryTemplate = {
  id: 'julie',
  name: '줄리',
  type: 'support',
  star: 3,
  maxHp: 2360,
  atk: 0,
  supportPower: 185.48,
  def: 0,
  emoji: '💚',
  critRate: 0,
  critDamage: 0,
  agility: 25,
  skill: {
    timing: 'after_attack',
    target: 'next_ally',
    attackRange: 'x_shape',
    rangeSize: 1,
    effects: [
      { type: 'regeneration', value: 2, duration: 5, buffType: 'stat_enhance' },
      { type: 'agility_up', value: 20, duration: 10, buffType: 'stat_enhance' },
    ],
  },
}
