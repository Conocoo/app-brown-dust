import type { MercenaryTemplate } from '../../../types/mercenary'

export const kaede: MercenaryTemplate = {
  id: 'kaede',
  name: '카에데',
  type: 'attacker',
  star: 5,
  maxHp: 2612,
  atk: 1237,
  def: 0,
  emoji: '⚔️',
  imageId: '4395',
  critRate: 10,
  critDamage: 75,
  agility: 15,
  skill: {
    timing: 'after_attack',
    target: 'enemy_second',
    attackRange: 'front_n',
    rangeSize: 2,
    effects: [
      { type: 'summon', value: 0, duration: 16, debuffClass: 'stat_weaken' },
      { type: 'shield', value: 20, duration: 16, debuffClass: 'stat_weaken' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
      { type: 'revival', value: 0, duration: 16, buffType: 'special', target: 'self' },
      { type: 'crit_damage_up', value: 50, duration: 16, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
