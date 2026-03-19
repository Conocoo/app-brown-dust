import type { MercenaryTemplate } from '../../../types/mercenary'

export const anais: MercenaryTemplate = {
  id: 'anais',
  name: '아나이스',
  type: 'support',
  star: 4,
  maxHp: 2587,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '1185',
  critRate: 0,
  critDamage: 0,
  agility: 5,
  skill: {
    timing: 'after_attack',
    target: 'next_ally',
    attackRange: 'x_shape',
    rangeSize: 1,
    effects: [
      { type: 'shield', value: 10, duration: 8, buffType: 'shield' },
      { type: 'regeneration', value: 2, duration: 5, buffType: 'stat_enhance' },
    ],
  },
}
