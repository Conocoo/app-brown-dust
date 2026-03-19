import type { MercenaryTemplate } from '../../../types/mercenary'

export const ridel: MercenaryTemplate = {
  id: 'ridel',
  name: '리델',
  type: 'attacker',
  star: 4,
  maxHp: 3068,
  atk: 1039,
  def: 3,
  emoji: '⚔️',
  imageId: '1035',
  critRate: 10,
  critDamage: 50,
  agility: 10,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'back_n',
    rangeSize: 2,
    effects: [
      { type: 'on_death_trigger', value: 0, duration: 6, debuffClass: 'stat_weaken' },
      { type: 'shield', value: 25, duration: 6, debuffClass: 'stat_weaken' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
      { type: 'crit_rate_up', value: 50, duration: 10, buffType: 'stat_enhance', target: 'self' },
      { type: 'atk_up', value: 75, duration: 10, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
