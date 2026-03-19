import type { MercenaryTemplate } from '../../../types/mercenary'

export const venus: MercenaryTemplate = {
  id: 'venus',
  name: '비너스',
  type: 'support',
  star: 5,
  maxHp: 4403,
  atk: 0,
  def: 15,
  emoji: '💚',
  imageId: '4585',
  critRate: 0,
  critDamage: 0,
  agility: 0,
  skill: {
    timing: 'passive',
    target: 'next_ally',
    attackRange: 'single',
    effects: [
      { type: 'equipment', value: 0, duration: 999, buffType: 'stat_enhance' },
      { type: 'summon', value: 0, duration: 999, buffType: 'stat_enhance' },
      { type: 'revival', value: 0, buffType: 'special' },
      { type: 'revival', value: 0, buffType: 'special' },
    ],
  },
}
