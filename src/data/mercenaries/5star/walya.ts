import type { MercenaryTemplate } from '../../../types/mercenary'

export const walya: MercenaryTemplate = {
  id: 'walya',
  name: '월야',
  type: 'support',
  star: 5,
  maxHp: 8396,
  atk: 0,
  def: 15,
  emoji: '💚',
  imageId: '3525',
  critRate: 0,
  critDamage: 0,
  agility: 25,
  skill: {
    timing: 'after_attack',
    target: 'next_ally',
    attackRange: 'horizontal',
    rangeSize: 4,
    effects: [
      { type: 'stealth', value: 0, duration: 10, buffType: 'special' },
      { type: 'crit_damage_up', value: 25, duration: 10, buffType: 'stat_enhance' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance' },
      { type: 'atk_up', value: 100, duration: 10, buffType: 'stat_enhance' },
      { type: 'shield', value: 35, duration: 10, buffType: 'shield' },
      { type: 'regeneration', value: 9, duration: 10, buffType: 'stat_enhance' },
    ],
  },
}
