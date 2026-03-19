import type { MercenaryTemplate } from '../../../types/mercenary'

export const christina: MercenaryTemplate = {
  id: 'christina',
  name: '크리스티나',
  type: 'attacker',
  star: 5,
  maxHp: 6201,
  atk: 1348,
  def: 5,
  emoji: '⚔️',
  imageId: '2695',
  critRate: 65,
  critDamage: 75,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'horizontal',
    rangeSize: 1,
    effects: [
      { type: 'atk_down', value: 75, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'on_attack_trigger', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'added_buff_25', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
