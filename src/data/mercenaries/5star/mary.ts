import type { MercenaryTemplate } from '../../../types/mercenary'

export const mary: MercenaryTemplate = {
  id: 'mary',
  name: '메리',
  type: 'support',
  star: 5,
  maxHp: 3355,
  atk: 0,
  def: 0,
  emoji: '💚',
  imageId: '1525',
  critRate: 0,
  critDamage: 0,
  agility: 15,
  skill: {
    timing: 'passive',
    target: 'next_ally',
    attackRange: 'front_n',
    rangeSize: 1,
    effects: [
      { type: 'on_attack_trigger', value: 0, duration: 999, buffType: 'stat_enhance' },
      { type: 'char_type_buff', value: 3, buffType: 'stat_enhance' },
      { type: 'atk_up', value: 55, duration: 12, buffType: 'stat_enhance' },
      { type: 'crit_damage_up', value: 55, duration: 12, buffType: 'stat_enhance' },
    ],
  },
}
