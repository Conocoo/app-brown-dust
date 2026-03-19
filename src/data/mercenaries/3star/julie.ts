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
      { type: 'purify_cc', value: 0 },
      { type: 'regeneration', value: 10, spScaling: true, duration: 14, buffType: 'stat_enhance' },
      { type: 'heal_percent', value: 5 },
      { type: 'agility_up', value: 50, spScaling: true, duration: 12, buffType: 'stat_enhance', ignoreImmunity: true },
      { type: 'on_hit_def_up', value: 0, duration: 12, buffType: 'special' },
      { type: 'def_up', value: 100, duration: 1, buffType: 'stat_enhance' },
    ],
  },
}
