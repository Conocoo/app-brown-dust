import type { MercenaryTemplate } from '../../../types/mercenary'

export const dr_morgan: MercenaryTemplate = {
  id: 'dr_morgan',
  name: 'Dr. 모건',
  type: 'attacker',
  star: 4,
  maxHp: 5180,
  atk: 606,
  def: 5,
  emoji: '⚔️',
  imageId: '2685',
  critRate: 15,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'passive',
    target: 'enemy_front',
    attackRange: 'horizontal',
    rangeSize: 2,
    effects: [
      { type: 'atk_down', value: 65, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'on_attack_trigger', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'char_type_buff', value: 1, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
