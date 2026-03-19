import type { MercenaryTemplate } from '../../../types/mercenary'

export const bdm_n0524: MercenaryTemplate = {
  id: 'bdm_n0524',
  name: 'BDM N-0524',
  type: 'defender',
  star: 4,
  maxHp: 6332,
  atk: 459,
  def: 15,
  emoji: '🛡️',
  imageId: '2675',
  critRate: 15,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'passive',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 2,
    effects: [
      { type: 'atk_down', value: 50, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'on_attack_trigger', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'char_type_buff', value: 1, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
